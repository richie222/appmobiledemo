// app/newGame.tsx
import { SEASONS_URL, GAMES_URL } from '@/config';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Switch,
  KeyboardAvoidingView,
  Platform,
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

export default function NewGameScreen() {
  
  useAuthGuard();
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingSeasons, setLoadingSeasons] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para el dropdown de temporadas
  const [openSeasons, setOpenSeasons] = useState(false);
  const [seasons, setSeasons] = useState<{label: string, value: number}[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<number | null>(null);
  
  // Estados para los campos del formulario
  const [teamScore, setTeamScore] = useState('');
  const [opposingTeamName, setOpposingTeamName] = useState('');
  const [opposingTeamScore, setOpposingTeamScore] = useState('');

  // Cargar temporadas al iniciar
  useEffect(() => {
    fetchSeasons();
  }, []);

  const fetchSeasons = async () => {
    try {
      setLoadingSeasons(true);
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
      
      // Si hay temporadas, seleccionar la primera por defecto
      if (seasonOptions.length > 0) {
        setSelectedSeasonId(seasonOptions[0].value);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoadingSeasons(false);
    }
  };

  const handleSaveGame = async () => {
    try {
      // Validaciones
      if (!selectedSeasonId) {
        Alert.alert('Error', 'Debe seleccionar un torneo');
        return;
      }
      
      if (!opposingTeamName.trim()) {
        Alert.alert('Error', 'El nombre del equipo rival es obligatorio');
        return;
      }
      
      if (!teamScore.trim()) {
        Alert.alert('Error', 'Las carreras de nuestro equipo es obligatorio');
        return;
      }
      
      if (!opposingTeamScore.trim()) {
        Alert.alert('Error', 'Las carreras del equipo rival es obligatorio');
        return;
      }
      
      if (isNaN(Number(teamScore))) {
        Alert.alert('Error', 'Las carreras de nuestro equipo debe ser un número válido');
        return;
      }
      
      if (isNaN(Number(opposingTeamScore))) {
        Alert.alert('Error', 'Las carreras del equipo rival debe ser un número válido');
        return;
      }
      
      setLoading(true);
      
      const storedToken = await SecureStore.getItemAsync('session_token');
      
      // Preparar datos para enviar
      const teamScoreNum = parseInt(teamScore);
      const opposingScoreNum = parseInt(opposingTeamScore);
      
      const gameData = {
        id_season: selectedSeasonId,
        team_score: teamScoreNum,
        opposing_team_name: opposingTeamName,
        opposing_team_score: opposingScoreNum
      };
      // Enviar datos a la API
      const response = await fetch(GAMES_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      });
      
      const text = await response.text();
      
      if (!response.ok) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Error al guardar el juego');
        } catch (jsonError) {
          throw new Error('Error al guardar el juego. Respuesta del servidor inválida.');
        }
      }
      
      // Mostrar mensaje de éxito
      Alert.alert(
        'Éxito',
        'Juego registrado correctamente',
        [
          { 
            text: 'OK', 
            onPress: () => router.dismissTo('/registerGame')
          }
        ]
      );
      
    } catch (err) {
      Alert.alert('Error', err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/registerGame');
  };

  // Calcular el resultado dinámicamente
  const calculateWin = () => {
    const teamScoreNum = parseInt(teamScore);
    const opposingScoreNum = parseInt(opposingTeamScore);
    
    if (!isNaN(teamScoreNum) && !isNaN(opposingScoreNum)) {
      return teamScoreNum > opposingScoreNum;
    }
    
    return false; // Por defecto, si no hay puntajes válidos, se considera derrota
  };

  const win = calculateWin();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <View style={styles.content}>
        
        {loadingSeasons ? (
          <ActivityIndicator size="large" color="#4caf50" />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            {/* Selector de Temporada */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Torneo</Text>
              <View style={styles.dropdownContainer}>
                <DropDownPicker
                  open={openSeasons}
                  value={selectedSeasonId}
                  items={seasons}
                  setOpen={setOpenSeasons}
                  setValue={val => setSelectedSeasonId(val)}
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
            
            {/* Nombre del Equipo Contrario */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Equipo Rival <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={opposingTeamName}
                onChangeText={setOpposingTeamName}
                placeholder="Nombre del equipo contrario"
              />
            </View>

            {/* Puntaje del Equipo Contrario */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Carreras del Rival <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={opposingTeamScore}
                onChangeText={setOpposingTeamScore}
                placeholder="Carreras del equipo rival"
                keyboardType="numeric"
              />
            </View>

            {/* Puntaje de Nuestro Equipo */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Carreas de Toros <Text style={styles.required}>*</Text></Text>
              <TextInput
                style={styles.input}
                value={teamScore}
                onChangeText={setTeamScore}
                placeholder="Carreas de nuestro equipo"
                keyboardType="numeric"
              />
            </View>
            
            {/* Estado de Victoria/Derrota */}
            <View style={styles.formGroup}>
              <View style={styles.winContainer}>
                <Text style={[styles.winStatus, { color: win ? 'green' : 'red' }]}>
                  {win ? 'Victoria' : 'Derrota'}
                </Text>
                <Switch
                  value={win}
                  disabled={true}
                  trackColor={{ false: '#e57373', true: '#81c784' }}
                  thumbColor={win ? '#4caf50' : '#f44336'}
                />
              </View>
              <Text style={styles.winNote}>
                El resultado se calcula automáticamente según las carreras.
              </Text>
            </View>
            
            {/* Botones */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={[styles.button, styles.buttonGreen]} 
                onPress={handleSaveGame}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Guardar</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}