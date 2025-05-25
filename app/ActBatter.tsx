import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAuth } from '@/contexts/auth-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { SEASONS_URL, GAMES_URL, STATS_PLAYER_URL } from '@/config';

export default function ActBatterScreen() {
  useAuthGuard();
  const router = useRouter();
  const { user } = useAuth();

  // Dropdown Temporadas
  const [openSeasons, setOpenSeasons] = useState(false);
  const [seasons, setSeasons] = useState<Array<{ label: string; value: number }>>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // Dropdown Juegos
  const [openGames, setOpenGames] = useState(false);
  const [games, setGames] = useState<Array<{ label: string; value: number }>>([]);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [loadingGames, setLoadingGames] = useState(false);

  // Estado para los datos ofensivos
  const [offensiveData, setOffensiveData] = useState<any>(null);
  const [loadingOffensive, setLoadingOffensive] = useState(false);

  // Cargar temporadas al montar
  useEffect(() => {
    const fetchSeasons = async () => {
      setLoadingSeasons(true);
      try {
        const res = await fetch(SEASONS_URL);
        const data = await res.json();
        const seasonItems = data.seasons.map((season: { id: number; name: string }) => ({
          label: season.name,
          value: season.id,
        }));
        setSeasons(seasonItems);
        /*if (seasonItems.length > 0) {
          setSelectedSeason(seasonItems[seasonItems.length - 1].value);
        }*/
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar las temporadas');
      } finally {
        setLoadingSeasons(false);
      }
    };
    fetchSeasons();
  }, []);

  // Define a type for the game object
  type Game = {
    id: number;
    win: boolean;
    opposing_team_name: string;
    team_score: number;
    opposing_team_score: number;
  };

  // Cargar juegos cuando cambia la temporada seleccionada
  useEffect(() => {
    if (!selectedSeason) {
      setGames([]);
      setSelectedGame(null);
      setOffensiveData(null);
      return;
    }
    const fetchGames = async () => {
      setLoadingGames(true);
      try {
        const res = await fetch(`${GAMES_URL}?id_season=${selectedSeason}`);
        const data = await res.json();
        const gameItems = data.games.map((game: Game) => ({
          label: `${game.win ? 'Victoria' : 'Derrota'}: ${game.team_score} - ${game.opposing_team_score} Vs ${game.opposing_team_name}`,
          value: game.id,
        }));
        setGames(gameItems);
        /*if (gameItems.length > 0) {
          setSelectedGame(gameItems[gameItems.length - 1].value);
        } else {
          setSelectedGame(null);
        }*/
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar los juegos');
      } finally {
        setLoadingGames(false);
      }
    };
    fetchGames();
  }, [selectedSeason]);

  // Cargar datos ofensivos cuando se selecciona un juego
  useEffect(() => {
    const fetchOffensiveData = async () => {
      if (!selectedSeason || !selectedGame || !user?.id) {
        setOffensiveData(null);
        return;
      }
      setLoadingOffensive(true);
      setOffensiveData(null);
      try {
        const url = `${STATS_PLAYER_URL}?id_season=${selectedSeason}&id_game=${selectedGame}&id_player=${user.id}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('No se encontró información');
        const data = await res.json();
        let offensiveStats = {};
        if (data.count === 0) {
          offensiveStats = { Mensaje: 'No hay datos ofensivos disponibles' };
        } else {
          const objdata = data.data[0];
          offensiveStats = {
            VB: objdata.vb,
            H: objdata.hit,
            "2B": objdata['2b'],
            "3B": objdata['3b'],
            HR: objdata.hr,
            BB: objdata.bb,
            K: objdata.kk,
          };
        }
        setOffensiveData(offensiveStats);
      } catch (e) {
        setOffensiveData(null);
        // Puedes mostrar un mensaje como texto si lo prefieres
      } finally {
        setLoadingOffensive(false);
      }
    };
    fetchOffensiveData();
  }, [selectedGame, selectedSeason, user?.id]);

  const handleCancel = () => {
    router.dismissTo('/');
  };

  const handleRegister = () => {
    const selectedSeasonLabel = seasons.find(s => s.value === selectedSeason)?.label;
    const selectedGameLabel = games.find(g => g.value === selectedGame)?.label;
    router.push({ 
      pathname: '/registerActBatter', 
      params: { 
      id_season: selectedSeason, 
      id_game: selectedGame,
      season_label: selectedSeasonLabel,
      game_label: selectedGameLabel
      } 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Jugador: {user?.username}</Text>

      {/* Dropdown de Temporadas */}
      <View style={{ zIndex: 2, width: '80%', marginBottom: 20 }}>
        <Text style={{ marginBottom: 5 }}>Torneo</Text>
        {loadingSeasons ? (
          <ActivityIndicator />
        ) : (
          <DropDownPicker
            open={openSeasons}
            value={selectedSeason}
            items={seasons}
            setOpen={setOpenSeasons}
            setValue={setSelectedSeason}
            setItems={setSeasons}
            placeholder="Selecciona un Torneo"
            zIndex={2000}
          />
        )}
      </View>

      {/* Dropdown de Juegos */}
      <View style={{ zIndex: 1, width: '80%', marginBottom: 20 }}>
        <Text style={{ marginBottom: 5 }}>Juego</Text>
        {loadingGames ? (
          <ActivityIndicator />
        ) : (
          <DropDownPicker
            open={openGames}
            value={selectedGame}
            items={games}
            setOpen={setOpenGames}
            setValue={setSelectedGame}
            setItems={setGames}
            placeholder="Selecciona un juego"
            disabled={!selectedSeason}
            zIndex={1000}
          />
        )}
      </View>

      {/* Mostrar datos ofensivos */}
      {loadingOffensive ? (
        <ActivityIndicator />
      ) : offensiveData ? (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Datos ofensivos:</Text>
          {Object.entries(offensiveData).map(([key, value]) => (
            <Text key={key} style={styles.dataText}>
              {key}: {String(value)}
            </Text>
          ))}
        </View>
      ) : null}

      {/* Botón Registrar Actuación */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonGreen]}
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Registrar Actuación</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonGreen: {
    backgroundColor: '#4caf50',
  },
  buttonRed: {
    backgroundColor: '#e57373',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dataContainer: {
    width: '80%',
    backgroundColor: '#f1f8e9',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  dataTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    fontSize: 16,
  },
  dataText: {
    fontSize: 15,
    marginBottom: 2,
  },
});