import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useAuth } from '@/contexts/auth-context';
import { STATS_PLAYER_URL } from '@/config';
import styles from './styles';

export default function RegisterActBatterScreen() {
  useAuthGuard();
  const router = useRouter();
  const { user, token } = useAuth();
  const { id_season, id_game, season_label, game_label } = useLocalSearchParams();

  // Estados para los campos de datos ofensivos
  const [vb, setVb] = useState(0);
  const [hit, setHit] = useState(0);
  const [doubles, setDoubles] = useState(0);
  const [triples, setTriples] = useState(0);
  const [hr, setHr] = useState(0);
  const [bb, setBb] = useState(0);
  const [kk, setKk] = useState(0);

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = () => {
    Alert.alert(
      'Confirmar',
      '¿Está seguro de guardar esta ofensiva?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Sí',
          onPress: () => doSubmit(),
        },
      ],
      { cancelable: false }
    );
  };

  const doSubmit = async () => {
    if (!id_season || !id_game || !user?.id) {
      Alert.alert('Error', 'Asegúrate de tener sesión activa y haber seleccionado torneo y juego');
      return;
    }

    setSubmitting(true);
    try {
      const offensiveData = {
        id_season: Number(id_season),
        id_game: Number(id_game),
        id_player: user.id,
        vb,
        hit,
        "2b": doubles,
        "3b": triples,
        hr,
        bb,
        kk
      };

      const response = await fetch(STATS_PLAYER_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(offensiveData),
      });

      if (!response.ok) {
        throw new Error('Error al enviar los datos');
      }

      Alert.alert('Éxito', 'Datos ofensivos registrados correctamente', [
        { text: 'OK', onPress: () => router.replace('/ActBatter') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron guardar los datos: ' + error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.dismissTo('/ActBatter');
  };

  // Componente reutilizable para cada campo numérico
  type CounterProps = {
    label: string;
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
  };

  const Counter: React.FC<CounterProps> = ({ label, value, setValue }) => (
    <View style={styles.counterRow}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => setValue(Math.max(0, value - 1))}
        >
          <Text style={styles.counterButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.counterValue}>{value}</Text>
        <TouchableOpacity
          style={styles.counterButton}
          onPress={() => setValue(value + 1)}
        >
          <Text style={styles.counterButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registrar Actuación Ofensiva</Text>

        {/* Mostrar Torneo y Juego como texto */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Torneo:</Text>
          <Text style={styles.valueText}>{season_label}</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Juego:</Text>
          <Text style={styles.valueText}>{game_label}</Text>
        </View>

        {/* Campos de datos ofensivos */}
        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Estadísticas Ofensivas</Text>
          <Counter label="Veces al Bate (VB)" value={vb} setValue={setVb}/>
          <Counter label="Hits (H)" value={hit} setValue={setHit} />
          <Counter label="Dobles (2B)" value={doubles} setValue={setDoubles} />
          <Counter label="Triples (3B)" value={triples} setValue={setTriples} />
          <Counter label="Home Runs (HR)" value={hr} setValue={setHr} />
          <Counter label="Base por Bolas (BB)" value={bb} setValue={setBb} />
          <Counter label="Ponches (K)" value={kk} setValue={setKk} />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.buttonGreen]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>
              {submitting ? 'Guardando...' : 'Guardar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

