// hooks/useAuthGuard.ts
import { useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { isTokenValid } from '@/utils/auth';
import { useAuth } from '@/contexts/auth-context'; // Ajusta la ruta según tu proyecto

export function useAuthGuard() {
  const router = useRouter();
  const { logout } = useAuth();

  useEffect(() => {
    const checkToken = async () => {
      const token = await SecureStore.getItemAsync('session_token');
      if (!isTokenValid(token)) {
        // Limpia el token y el estado de usuario
        await SecureStore.deleteItemAsync('session_token');
        if (logout) logout(); // Limpia el contexto de usuario
        router.dismissTo('/login')
      }
    };
    checkToken();
  }, []);
}