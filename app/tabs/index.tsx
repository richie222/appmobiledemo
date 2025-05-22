import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  const goToLogin = () => {
    router.push('/tabs/login'); // Ajusta la ruta si tu pantalla de login tiene otro nombre
  };

  const goToRegister = () => {
    router.push('/tabs/registrousuario'); // Ajusta la ruta si tu pantalla de registro tiene otro nombre
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenidos Toros</Text>
      <View style={styles.buttonContainer}>
        <Button title="Iniciar Sesión" onPress={goToLogin} />
        <View style={{ height: 16 }} />
        <Button title="Registrar Jugador" onPress={goToRegister} />
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
});