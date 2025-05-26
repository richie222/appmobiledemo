import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/auth-context';
import styles from './styles';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <AuthProvider>
        <Stack>
          {/* Pantalla principal (home) */}
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Toros Softball',
              headerShown: true,
              headerStyle: {
                backgroundColor: styles.colorBlack.color,
              },
              headerTitleStyle: {
                color: styles.colorWhite.color,
              },
            }}
          />
          
          {/* Otras pantallas */}
            <Stack.Screen name="login" options={{ 
              title: 'Sesión',
              headerStyle: {
                backgroundColor: styles.colorBlack.color,
              },
              headerTitleStyle: {
                color: styles.colorWhite.color,
              },
              headerTintColor: styles.colorWhite.color,
              }} />
            <Stack.Screen name="registerBatter" options={{ 
              title: 'Registrar',
              headerStyle: {
                backgroundColor: styles.colorBlack.color,
              },
              headerTitleStyle: {
                color: styles.colorWhite.color,
              },
              headerTintColor: styles.colorWhite.color,
              }} />
            <Stack.Screen name="newSeason" options={{ 
              title: 'Mantenimiento',
              headerStyle: {
                backgroundColor: styles.colorBlack.color,
              },
              headerTitleStyle: {
                color: styles.colorWhite.color,
              },
              headerTintColor: styles.colorWhite.color,
              }} />
            <Stack.Screen name="registerGame" options={{ 
              title: 'Juegos por Torneo',
              headerStyle: {
                backgroundColor: styles.colorBlack.color,
              },
              headerTitleStyle: {
                color: styles.colorWhite.color,
              },
              headerTintColor: styles.colorWhite.color,
              }} />
            <Stack.Screen name="ActBatter" options={{ 
              title: 'Actuación',
              headerStyle: {
                backgroundColor: styles.colorBlack.color,
              },
              headerTitleStyle: {
                color: styles.colorWhite.color,
              },
              headerTintColor: styles.colorWhite.color,
              }} />
            <Stack.Screen name="newGame" options={{ 
              title: 'Registrar nuevo juego',
              headerStyle: {
                backgroundColor: styles.colorBlack.color,
              },
              headerTitleStyle: {
                color: styles.colorWhite.color,
              },
              headerTintColor: styles.colorWhite.color,
              }} />
            <Stack.Screen name="registerActBatter" options={{ 
              title: 'Ofensiva Jugador',
              headerStyle: {
                backgroundColor: styles.colorBlack.color,
              },
              headerTitleStyle: {
                color: styles.colorWhite.color,
              },
              headerTintColor: styles.colorWhite.color,
              }} />
            <Stack.Screen name="statsTeam" options={{ 
              title: 'Ofensiva Torneo',
              headerStyle: {
                backgroundColor: styles.colorBlack.color,
              },
              headerTitleStyle: {
                color: styles.colorWhite.color,
              },
              headerTintColor: styles.colorWhite.color,
              }} />
          {/* Agrega aquí más pantallas si lo necesitas */}
        </Stack>
      </AuthProvider>
    </>
  );
}