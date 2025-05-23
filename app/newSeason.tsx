// app/newSeason.tsx
import { SEASONS_URL } from '@/config';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Button,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as SecureStore from 'expo-secure-store';

type Season = {
  id: number;
  name: string;
  date_ini: string;
};

export default function NewSeasonScreen() {
  const router = useRouter();
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [name, setName] = useState('');
  const [dateIni, setDateIni] = useState('');

  const fetchSeasons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(SEASONS_URL);
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
      setSeasons(data.seasons || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSeasons();
  }, []);

  const handleCancel = () => {
    router.replace('/');
  };

  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={[styles.headerCell, { width: '15%' }]}>Id</Text>
      <Text style={[styles.headerCell, { width: '40%' }]}>Temporada</Text>
      <Text style={[styles.headerCell, { width: '30%' }]}>Inicio</Text>
      <Text style={[styles.headerCell, { width: '15%' }]}>Acciones</Text>
    </View>
  );

  const renderItem = ({ item }: { item: Season }) => (
    <View style={styles.dataRow}>
      <Text style={[styles.dataCell, { width: '15%' }]}>{item.id}</Text>
      <Text style={[styles.dataCell, { width: '40%' }]}>{item.name}</Text>
      <Text style={[styles.dataCell, { width: '30%' }]}>
        {new Date(item.date_ini).toLocaleDateString()}
      </Text>
      <TouchableOpacity
        style={[styles.editButton, { width: '15%' }]}
        onPress={() => handleEditSeason(item)}
      >
        <Icon name="pencil" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const handleCreateSeason = () => {
    setEditingSeason(null);
    setName('');
    setDateIni('');
    setModalVisible(true);
  };

  const handleEditSeason = (season: Season) => {
    setEditingSeason(season);
    setName(season.name);
    
    // Formatear la fecha al formato YYYY-MM-DD
    const date = new Date(season.date_ini);
    const formattedDate = date.toISOString().split('T')[0];
    setDateIni(formattedDate);
    
    setModalVisible(true);
  };

  const handleSaveSeason = async () => {
    try {
      // Validación básica
      if (!name.trim()) {
        Alert.alert('Error', 'El nombre de la temporada es obligatorio');
        return;
      }
      
      if (!dateIni.trim()) {
        Alert.alert('Error', 'La fecha de inicio es obligatoria');
        return;
      }
      
      // Validar formato de fecha (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(dateIni)) {
        Alert.alert('Error', 'La fecha debe tener el formato YYYY-MM-DD');
        return;
      }

      setLoading(true);
      setError(null);

      const seasonData = {
        name: name,
        date_ini: dateIni,
      };

      // Obtener el token de autenticación
      const storedToken = await SecureStore.getItemAsync('session_token');
      
      if (!storedToken) {
        throw new Error('No se encontró el token de autenticación');
      }

      let response;
      let url;
      let method;

      if (editingSeason) {
        // Editar temporada
        url = `${SEASONS_URL}/${editingSeason.id}`;
        method = 'PUT';
      } else {
        // Crear temporada
        url = SEASONS_URL;
        method = 'POST';
      }

      console.log(`Enviando solicitud ${method} a ${url}`);
      
      response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${storedToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(seasonData),
      });

      const text = await response.text();
      console.log('Respuesta de la API:', text);

      if (!response.ok) {
        try {
          const errorData = JSON.parse(text);
          throw new Error(errorData.message || 'Error al guardar la temporada');
        } catch (jsonError) {
          throw new Error(`Error al guardar la temporada. Código: ${response.status}`);
        }
      }

      // Mostrar mensaje de éxito
      Alert.alert(
        'Éxito',
        editingSeason 
          ? 'Temporada actualizada correctamente' 
          : 'Temporada creada correctamente',
        [{ text: 'OK' }]
      );

      setModalVisible(false);
      fetchSeasons(); // Recargar la lista de temporadas
    } catch (err) {
      console.error('Error en handleSaveSeason:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido');
      Alert.alert('Error', err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mantenimiento de Temporadas</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={handleCreateSeason}>
          <Text style={styles.buttonText}>Crear Temporada</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={handleCancel}>
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      {loading && <ActivityIndicator size="large" color="#4caf50" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      {!loading && !error && (
        <FlatList
          data={seasons}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={<Text style={styles.emptyText}>No hay temporadas registradas.</Text>}
          style={{ width: '100%' }}
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              {editingSeason ? 'Editar Temporada' : 'Crear Temporada'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre de la temporada"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha de inicio (YYYY-MM-DD)"
              value={dateIni}
              onChangeText={setDateIni}
            />
            <View style={styles.modalButtons}>
              <Button title="Guardar" onPress={handleSaveSeason} />
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 20,
  },
  buttonContainer: {
    width: '80%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    width: '45%',
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
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  headerCell: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  dataRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dataCell: {
    fontSize: 14,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});