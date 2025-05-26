// components/HomeButtons.jsx
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import styles from './styles';


const Home = () => {
  const router = useRouter();
  const { logout, isLoggedIn, rol, superuser } = useAuth();

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
    router.push('/ActBatter');
  };

  const goToRegisterActBatter = () => {
    router.push('/registerBatter');
  };

  const handleLogout = async () => {
    await logout();
    router.dismissTo('/')
  };

  const goToRegisterStatsTeam = () => {
    router.push('/statsTeam');
  };

  const isAdmin = rol === 'A' || superuser === 'S';

return (
  <View style={styles.buttonContainerHome}>
    {!isLoggedIn && (
      <TouchableOpacity style={[styles.buttonHome, styles.buttonGreen]} onPress={goToLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
    )}

    {isLoggedIn && (
      <>
        {isAdmin ? (
          <>
            <TouchableOpacity style={[styles.buttonHome, styles.buttonGreen]} onPress={goToRegisterBatter}>
              <Text style={styles.buttonText}>Registrar Jugador</Text>
            </TouchableOpacity>
            <View style={{ height: 16 }} />

            <TouchableOpacity style={[styles.buttonHome, styles.buttonGreen]} onPress={goToNewSeason}>
              <Text style={styles.buttonText}>Mantenimiento de Temporadas</Text>
            </TouchableOpacity>
            <View style={{ height: 16 }} />

            <TouchableOpacity style={[styles.buttonHome, styles.buttonGreen]} onPress={goToRegisterGame}>
              <Text style={styles.buttonText}>Mantenimiento Juegos/Resultados</Text>
            </TouchableOpacity>
            <View style={{ height: 16 }} />

            <TouchableOpacity style={[styles.buttonHome, styles.buttonGreen]} onPress={goTomaintBatter}>
              <Text style={styles.buttonText}>Mantenimiento de Act. de Bateador</Text>
            </TouchableOpacity>
            <View style={{ height: 16 }} />
            <TouchableOpacity style={[styles.buttonHome, styles.buttonGreen]} onPress={goToRegisterStatsTeam}>
              <Text style={styles.buttonText}>Avg. por Torneo</Text>
            </TouchableOpacity>
            <View style={{ height: 16 }} />
          </>
        ) : (
          <>
            <TouchableOpacity style={[styles.buttonHome, styles.buttonGreen]} onPress={goTomaintBatter}>
              <Text style={styles.buttonText}>Registrar Act. de Bateador</Text>
            </TouchableOpacity>
            <View style={{ height: 16 }} />
            <TouchableOpacity style={[styles.buttonHome, styles.buttonGreen]} onPress={goToRegisterStatsTeam}>
              <Text style={styles.buttonText}>Avg. por Torneo</Text>
            </TouchableOpacity>
            <View style={{ height: 16 }} />
          </>
        )}

        <TouchableOpacity style={[styles.buttonHome, styles.buttonGray]} onPress={handleLogout}>
          <Text style={styles.buttonText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </>
    )}
  </View>
  );
};

export default Home;