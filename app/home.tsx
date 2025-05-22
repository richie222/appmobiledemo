// components/HomeButtons.jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';


const Home = () => {
  const router = useRouter();
  const { logout, isLoggedIn } = useAuth();

  const goToLogin = () => {
    router.push('/login');
  };

  const goToRegisterBatter = () => {
    router.push('/registerBatter');
  };

  const goToNewSeason = () => {
    router.push('/newSeason');
  };

  const goToRegisterGame = () => {
    router.push('/registerGame');
  };

  const goTomaintBatter = () => {
    router.push('/maintBatter');
  };

  const goToRegisterActBatter = () => {
    router.push('/registerActBatter');
  };

  const handleLogout = async () => {
    await logout();
    router.dismissTo('/')
  };

  return (
    <View style={styles.buttonContainer}>

      <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={goToRegisterBatter}>
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
      <TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={goToRegisterActBatter}>
        <Text style={styles.buttonText}>Registrar Act. de Bateador</Text>
      </TouchableOpacity>

      {!isLoggedIn ? (
          <><View style={{ height: 16 }} /><TouchableOpacity style={[styles.button, styles.buttonGreen]} onPress={goToLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity></>
      ) : ( 
          <><View style={{ height: 16 }} /><TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity></>
      )}

    </View>
  );
};

const styles = StyleSheet.create({
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

export default Home;