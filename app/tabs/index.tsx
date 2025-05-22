import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/tabs/login');
  };

  const goToRegister = () => {
    router.push('/tabs/registrousuario');
  };

  const goToNewSeason = () => {
    router.push('/tabs/newSeason'); // Reemplaza con la ruta correcta
  };

  const goToRegisterGame = () => {
    router.push('/tabs/registerGame'); // Reemplaza con la ruta correcta
  };

  const goTomaintBatter = () => {
    router.push('/tabs/maintBatter'); // Reemplaza con la ruta correcta
  };

  const goToRegisterBatter = () => {
    router.push('/tabs/registerBatter'); // Reemplaza con la ruta correcta
  };

  const handleLogout = () => {
    // Aquí puedes agregar la lógica para cerrar sesión
    router.replace('/tabs'); // Redirige al inicio (o a la pantalla de login)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenidos Toros</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={goToLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
        <View style={{ height: 16 }} />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={goToRegister}>
          <Text style={styles.buttonText}>Registrar Jugador</Text>
        </TouchableOpacity>
        <View style={{ height: 16 }} />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={goToNewSeason}>
          <Text style={styles.buttonText}>Mantenimiento de Temporadas</Text>
        </TouchableOpacity>
        <View style={{ height: 16 }} />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={goToRegisterGame}>
          <Text style={styles.buttonText}>Mantenimiento Juegos/Resultados</Text>
        </TouchableOpacity>
        <View style={{ height: 16 }} />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={goTomaintBatter}>
          <Text style={styles.buttonText}>Mantenimiento de Act. de Bateador</Text>
        </TouchableOpacity>
        <View style={{ height: 16 }} />
        <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={goToRegisterBatter}>
          <Text style={styles.buttonText}>Registrar Act. de Bateador</Text>
        </TouchableOpacity>
        <View style={{ height: 16 }} />
        <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
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
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 48,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '80%',
    alignItems: 'center',
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
});