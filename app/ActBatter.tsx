import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAuth } from '@/contexts/auth-context';
import DropDownPicker from 'react-native-dropdown-picker';
import { SEASONS_URL, GAMES_URL, STATS_PLAYER_URL, LIST_PLAYERS_URL } from '@/config';
import styles from './styles';

export default function ActBatterScreen() {
  useAuthGuard();
  const router = useRouter();
  const { user } = useAuth();

  // Obtén rol y superuser del usuario
  const rol = user?.rol;
  const superuser = user?.superuser;
  const isAdmin = rol === 'A' || superuser === 'S';

  // Dropdown Bateadores (solo para admin)
  const [openPlayers, setOpenPlayers] = useState(false);
  const [players, setPlayers] = useState<Array<{ label: string; value: number }>>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<number | null>(null);

  // Dropdown Temporadas
  const [openSeasons, setOpenSeasons] = useState(false);
  const [seasons, setSeasons] = useState<Array<{ label: string; value: number }>>([]);
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);

  // Dropdown Juegos
  const [openGames, setOpenGames] = useState(false);
  const [games, setGames] = useState<Array<{ label: string; value: number }>>([]);
  const [selectedGame, setSelectedGame] = useState<number | null>(null);

  const [loadingPlayers, setLoadingPlayers] = useState(false);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [loadingGames, setLoadingGames] = useState(false);

  // Estado para los datos ofensivos
  const [offensiveData, setOffensiveData] = useState<any>(null);
  const [loadingOffensive, setLoadingOffensive] = useState(false);

  const [offensiveDataParams, setOffensiveDataParams] = useState<any>(null);

  // Estado para saber si ya hay datos ofensivos
  const [hasOffensiveData, setHasOffensiveData] = useState(false);

  // Cargar bateadores solo si es admin
  useEffect(() => {
    if (!isAdmin) return;
    
    const fetchPlayers = async () => {
      setLoadingPlayers(true);
      try {
        const res = await fetch(LIST_PLAYERS_URL);
        const data = await res.json();
        const playerItems = data.users.map((player: { id: number; username: string }) => ({
          label: player.username,
          value: player.id,
        }));

        setPlayers(playerItems);
      } catch (e) {
        Alert.alert('Error', 'No se pudieron cargar los bateadores');
      } finally {
        setLoadingPlayers(false);
      }
    };
    fetchPlayers();
  }, [isAdmin]);

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
      setHasOffensiveData(false);
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
      // Determinar qué jugador usar: el seleccionado (si es admin) o el usuario actual
      let currentPlayerId: number | null = null;
      if (isAdmin) {
        // Si es admin, solo consultar si seleccionó un bateador
        currentPlayerId = selectedPlayer ? Number(selectedPlayer) : null;
      } else {
        // Si no es admin, siempre el usuario autenticado
        currentPlayerId = user?.id ?? null;
      }
      if (!selectedSeason || !selectedGame || !currentPlayerId) {
        setOffensiveData(null);
        setHasOffensiveData(false);
        return;
      }
      setLoadingOffensive(true);
      setOffensiveData(null);
      try {
        const url = `${STATS_PLAYER_URL}?id_season=${selectedSeason}&id_game=${selectedGame}&id_player=${currentPlayerId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('No se encontró información');
        const data = await res.json();

        let offensiveStats = {};
        if (data.count === 0) {
          offensiveStats = { Mensaje: 'No hay datos ofensivos disponibles' };
          setHasOffensiveData(false);
        } else {
          const objdata = data.data[0];
          offensiveStats = {
            id_rec: objdata.id,
            VB: objdata.vb,
            H: objdata.hit,
            "2B": objdata['2b'],
            "3B": objdata['3b'],
            HR: objdata.hr,
            BB: objdata.bb,
            K: objdata.kk,
          };
          setHasOffensiveData(true);

        }

            // Eliminar la llave id_rec antes de setear el estado
            const { id_rec, ...offensiveStatsWithoutIdRec } = offensiveStats as any;
            setOffensiveData(offensiveStatsWithoutIdRec);

          setOffensiveDataParams(offensiveStats);

      } catch (e) {
        setOffensiveData({ Mensaje: 'No hay datos ofensivos disponibles' });
        setHasOffensiveData(false);
      } finally {
        setLoadingOffensive(false);
      }
    };
    fetchOffensiveData();
  }, [selectedGame, selectedSeason, selectedPlayer, user?.id, isAdmin]);

  const handleRegister = () => {
    const selectedSeasonLabel = seasons.find(s => s.value === selectedSeason)?.label;
    const selectedGameLabel = games.find(g => g.value === selectedGame)?.label;
    const selectedPlayerId = isAdmin ? players.find(g => g.value === selectedPlayer)?.value : user?.id;

    router.push({ 
      pathname: '/registerActBatter', 
      params: { 
        id_season: selectedSeason, 
        id_game: selectedGame,
        season_label: selectedSeasonLabel,
        game_label: selectedGameLabel,
        selectedPlayerId: selectedPlayerId,
        datos_off: JSON.stringify(offensiveDataParams)
      } 
    });
  };

  return (
    <View style={styles.container}>
      {!isAdmin && (
        <Text style={styles.title}>
          Jugador:  {user?.username}
        </Text>
      )}

      {/* Dropdown de Bateadores (solo para admin) */}
      {isAdmin && (
        <View style={{ zIndex: 3, width: '100%', marginBottom: 20 }}>
          <Text style={styles.label}>Bateador</Text>
          {loadingPlayers ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.dropdownContainer}>
              <DropDownPicker
                open={openPlayers}
                value={selectedPlayer}
                items={players}
                setOpen={setOpenPlayers}
                setValue={setSelectedPlayer}
                setItems={setPlayers}
                placeholder="Selecciona un Bateador"
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                listItemLabelStyle={styles.dropdownItem}
                placeholderStyle={styles.dropdownPlaceholder}
                zIndex={3000}
              />
            </View>
          )}
        </View>
      )}

      {/* Dropdown de Temporadas */}
      <View style={{ zIndex: 2, width: '100%', marginBottom: 20 }}>
        <Text style={styles.label}>Torneo</Text>
        {loadingSeasons ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={openSeasons}
              value={selectedSeason}
              items={seasons}
              setOpen={setOpenSeasons}
              setValue={setSelectedSeason}
              setItems={setSeasons}
              placeholder="Selecciona un Torneo"
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownList}
              listItemLabelStyle={styles.dropdownItem}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={2000}
            />
          </View>
        )}
      </View>

      {/* Dropdown de Juegos */}
      <View style={{ zIndex: 1, width: '100%', marginBottom: 20 }}>
        <Text style={styles.label}>Juego</Text>
        {loadingGames ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.dropdownContainer}>
            <DropDownPicker
              open={openGames}
              value={selectedGame}
              items={games}
              setOpen={setOpenGames}
              setValue={setSelectedGame}
              setItems={setGames}
              placeholder="Selecciona un juego"
              disabled={!selectedSeason}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownList}
              listItemLabelStyle={styles.dropdownItem}
              placeholderStyle={styles.dropdownPlaceholder}
              zIndex={1000}
            />
          </View>
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
          style={[
            styles.button,
            styles.buttonGreen,
            (hasOffensiveData && !isAdmin) && { opacity: 0.5 }
          ]}
          onPress={handleRegister}
          disabled={hasOffensiveData && !isAdmin}
        >
            <Text style={styles.buttonText}>
              Actualizar actuación
            </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}