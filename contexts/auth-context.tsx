import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { LOGIN_URL, LOGOUT_URL } from '@/config';

// Actualizamos el tipo User para incluir rol y superuser
type User = {
  id: number;
  username: string;
  email: string;
  rol: string;      // Nuevo campo
  superuser: string; // Nuevo campo
};

type LoginResponse = {
  message: string;
  token: string;
  user: User;
};

// Actualizamos AuthContextType para exponer rol y superuser
type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
  rol: string | null;       // Nuevo campo
  superuser: string | null; // Nuevo campo
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  user: null,
  rol: null,       // Nuevo campo
  superuser: null, // Nuevo campo
  login: async () => {},
  logout: async () => {},
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [rol, setRol] = useState<string | null>(null);       // Nuevo estado
  const [superuser, setSuperuser] = useState<string | null>(null); // Nuevo estado
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('session_token');
        const storedUser = await SecureStore.getItemAsync('user_data');
        const storedRol = await SecureStore.getItemAsync('user_rol');       // Nuevo
        const storedSuperuser = await SecureStore.getItemAsync('user_superuser'); // Nuevo
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
          // Establecemos rol y superuser si existen
          if (storedRol) setRol(storedRol);
          if (storedSuperuser) setSuperuser(storedSuperuser);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await fetch(LOGIN_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el inicio de sesión');
      }

      const data: LoginResponse = await response.json();
      
      // Guardamos el token y los datos del usuario
      await SecureStore.setItemAsync('session_token', data.token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(data.user));
      
      // Guardamos rol y superuser por separado para facilitar el acceso
      if (data.user.rol) {
        await SecureStore.setItemAsync('user_rol', data.user.rol);
        setRol(data.user.rol);
      }
      
      if (data.user.superuser) {
        await SecureStore.setItemAsync('user_superuser', data.user.superuser);
        setSuperuser(data.user.superuser);
      }
      
      setToken(data.token);
      setUser(data.user);

    } catch (error) {
        console.error('Login failed:', error);
        throw error; // Re-lanzamos el error para que el componente de login pueda manejarlo
    }
  };

  const logout = async () => {
    try {
      // Obtén el token actual
      const storedToken = await SecureStore.getItemAsync('session_token');
      if (storedToken) {
        // Llama al endpoint de logout con el token en el header
        await fetch(LOGOUT_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
      }

      // Limpia el almacenamiento seguro
      await SecureStore.deleteItemAsync('session_token');
      await SecureStore.deleteItemAsync('user_data');
      await SecureStore.deleteItemAsync('user_rol');       // Nuevo
      await SecureStore.deleteItemAsync('user_superuser'); // Nuevo
      
      setToken(null);
      setUser(null);
      setRol(null);       // Nuevo
      setSuperuser(null); // Nuevo
    } catch (error) {
      console.error('Logout failed:', error);
      // Puedes mostrar un mensaje al usuario si lo deseas
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        user,
        rol,       // Nuevo
        superuser, // Nuevo
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};