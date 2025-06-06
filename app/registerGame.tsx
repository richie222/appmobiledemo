// app/registerGame.tsx
import { SEASONS_URL, GAMES_URL } from '@/config';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import DropDownPicker from 'react-native-dropdown-picker';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import styles from './styles';

type Season = {
  id: number;
  name: string;
  date_ini: string;
};

type Game = {
  id: number;
  id_season: number;
  win: boolean;
  team_score: number;
  opposing_team_name: string;
  opposing_team_score: number;
};

type GamesResponse = {
  message: string;
  count: number;
  season: {
    name: string;
    date_ini: string;
  };
  games: Game[];
};

export default function RegisterGameScreen() {

  useAuthGuard();

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el dropdown de temporadas
  const [open, setOpen] = useState(false);
  const [seasons, setSeasons] = useState<{label: string, value: number}[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  
  // Estado para los juegos
  const [games, setGames] = useState<Game[]>([]);
  const [seasonInfo, setSeasonInfo] = useState<{name: string, date_ini: string} | null>(null);
  const [loadingGames, setLoadingGames] = useState(false);

  // Obtener las temporadas al cargar la pantalla
  useEffect(() => {
    fetchSeasons();
  }, []);

  // Obtener los juegos cuando cambia la temporada seleccionada
  useEffect(() => {
    if (selectedSeasonId) {
      fetchGames(selectedSeasonId);
    
    }
  }, [selectedSeasonId]);

  const fetchSeasons = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const storedToken = await SecureStore.getItemAsync('session_token');
      
      const response = await fetch(SEASONS_URL, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        }
      });
      
      const text = await response.text();
      
      if (!response.ok) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Error al obtener temporadas');
        } catch (jsonError) {
          throw new Error('Error al obtener temporadas. Respuesta del servidor inválida.');
        }
      }
      
      const data = JSON.parse(text);
      
      // Ordenar temporadas por fecha de inicio descendente
      const sortedSeasons = (data.seasons || []).sort(
        (a: Season, b: Season) => new Date(b.date_ini).getTime() - new Date(a.date_ini).getTime()
      );
      
      // Transformar los datos para el dropdown
      const seasonOptions = sortedSeasons.map((season: Season) => ({
        label: season.name,
        value: season.id
      }));
      
      setSeasons(seasonOptions);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const fetchGames = async (seasonId: number) => {
    try {
      setLoadingGames(true);
      
      const storedToken = await SecureStore.getItemAsync('session_token');
      
      const response = await fetch(`${GAMES_URL}?id_season=${seasonId}`, {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        }
      });
      
      const text = await response.text();
      
      if (!response.ok) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Error al obtener juegos');
        } catch (jsonError) {
          throw new Error('Error al obtener juegos. Respuesta del servidor inválida.');
        }
      }
      
      const data: GamesResponse = JSON.parse(text);
      
      // Ordenar juegos por ID descendente
      const sortedGames = (data.games || []).sort((a, b) => b.id - a.id);
      
      setGames(sortedGames);
      setSeasonInfo(data.season);
      
    } catch (err) {
      console.error('Error al obtener juegos:', err);
      Alert.alert('Error', err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoadingGames(false);
    }
  };

  const handleCreateGame = () => {
    // Navegar a la nueva vista de creación de juegos
    router.push('/newGame');
  };

  const handleCancel = () => {
    router.replace('/');
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, { width: '10%' }]}>Id</Text>
      <Text style={[styles.headerCell, { width: '30%' }]}>Equipo</Text>
      <Text style={[styles.headerCell, { width: '15%' }]}>Nuestro</Text>
      <Text style={[styles.headerCell, { width: '15%' }]}>Rival</Text>
      <Text style={[styles.headerCell, { width: '15%' }]}>Estado</Text>
    </View>
  );

  const renderGameItem = ({ item }: { item: Game }) => (
    <View style={styles.dataRow}>
      <Text style={[styles.dataCell, { width: '10%' }]}>{item.id}</Text>
      <Text style={[styles.dataCell, { width: '30%' }]}>{item.opposing_team_name}</Text>
      <Text style={[styles.dataCell, { width: '15%' }]}>{item.team_score}</Text>
      <Text style={[styles.dataCell, { width: '15%' }]}>{item.opposing_team_score}</Text>
      <Text 
        style={[
          styles.dataCell, 
          { width: '15%', color: item.win ? 'green' : 'red', fontWeight: 'bold' }
        ]}
      >
        {item.win ? 'Victoria' : 'Derrota'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.content}>
       
        {loading ? (
          <ActivityIndicator size="large" color="#4caf50" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <View style={styles.seasonSelector}>
              <Text style={styles.label}>Torneo</Text>
              <View style={styles.dropdownContainer}>
                <DropDownPicker
                  open={open}
                  value={selectedSeasonId}
                  items={seasons}
                  setOpen={setOpen}
                  setValue={setSelectedSeasonId}
                  setItems={setSeasons}
                  placeholder="Seleccione un torneo"
                  style={styles.dropdown}
                  dropDownContainerStyle={styles.dropdownList}
                  listItemLabelStyle={styles.dropdownItem}
                  placeholderStyle={styles.dropdownPlaceholder}
                  zIndex={3000}
                />
              </View>
            </View>
            
            {selectedSeasonId && (
              <View style={styles.gamesContainer}>
                <View style={styles.seasonInfoContainer}>
                  {seasonInfo && (
                    <Text style={styles.seasonInfo}>
                      Juegos: {seasonInfo.name}
                    </Text>
                  )}
                </View>
                
                {loadingGames ? (
                  <ActivityIndicator size="large" color="#4caf50" />
                ) : (
                  <>
                    {games.length > 0 ? (
                      <FlatList
                        data={games}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={renderGameItem}
                        ListHeaderComponent={renderHeader}
                        style={styles.gamesList}
                      />
                    ) : (
                      <Text style={styles.emptyText}>No hay juegos registrados para esta temporada.</Text>
                    )}
                  </>
                )}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity 
                    style={[styles.button, styles.buttonGreen, styles.newGameButton]} 
                    onPress={handleCreateGame}
                  >
                    <Text style={styles.buttonText}>Nuevo Juego</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
}