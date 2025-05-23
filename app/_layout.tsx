import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from '@/contexts/auth-context';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <AuthProvider>
        <Stack>
          {/* Pantalla principal (home) */}
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Toros Softball',
              headerShown: true,
            }} 
          />
          
          {/* Otras pantallas */}
          <Stack.Screen name="login" options={{ title: 'Iniciar Sesión' }} />
          <Stack.Screen name="registerBatter" options={{ title: 'Registrar Jugador' }} />
          <Stack.Screen name="newSeason" options={{ title: 'Mantenimiento' }} />
          <Stack.Screen name="registerGame" options={{ title: 'Juegos por Torneo' }} />
          <Stack.Screen name="registerActBatter" options={{ title: 'Registrar' }} />
          <Stack.Screen name="maintBatter" options={{ title: 'Mantenimiento' }} />
          <Stack.Screen name="newGame" options={{ title: 'Registrar nuevo juego' }} />
          {/* Agrega aquí más pantallas si lo necesitas */}
        </Stack>
      </AuthProvider>
    </>
  );
}