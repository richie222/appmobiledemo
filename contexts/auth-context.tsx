import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { LOGIN_URL, LOGOUT_URL, REGISTER_URL } from '@/config';

// Definimos los tipos según la respuesta de tu API
type User = {
  id: number;
  username: string;
  email: string;
  rol: string;
  superuser: string;
};

type LoginResponse = {
  message: string;
  token: string;
  user: User;
};

// Tipo para la respuesta de registro
type RegisterResponse = {
  message: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
};

// Tipo para los datos de registro
type RegisterData = {
  username: string;
  email: string;
  password: string;
};

type AuthContextType = {
  isLoggedIn: boolean;
  token: string | null;
  user: User | null;
  rol: string | null;
  superuser: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (data: RegisterData) => Promise<RegisterResponse>; // Nueva función
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  token: null,
  user: null,
  rol: null,
  superuser: null,
  login: async () => {},
  logout: async () => {},
  register: async () => ({ message: '' }), // Valor por defecto
  loading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [superuser, setSuperuser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('session_token');
        const storedUser = await SecureStore.getItemAsync('user_data');
        const storedRol = await SecureStore.getItemAsync('user_rol');
        const storedSuperuser = await SecureStore.getItemAsync('user_superuser');
        
        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
          
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
      
      await SecureStore.setItemAsync('session_token', data.token);
      await SecureStore.setItemAsync('user_data', JSON.stringify(data.user));
      
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
      throw error;
    }
  };

  const logout = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync('session_token');
      if (storedToken) {
        await fetch(LOGOUT_URL, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json',
          },
        });
      }

      await SecureStore.deleteItemAsync('session_token');
      await SecureStore.deleteItemAsync('user_data');
      await SecureStore.deleteItemAsync('user_rol');
      await SecureStore.deleteItemAsync('user_superuser');
      
      setToken(null);
      setUser(null);
      setRol(null);
      setSuperuser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Nueva función de registro
  const register = async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await fetch(REGISTER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        // Si el servidor devuelve un error (400, etc.)
        throw new Error(responseData.message || 'Error en el registro');
      }

      // Si el registro fue exitoso (201)
      return responseData;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token,
        user,
        rol,
        superuser,
        login,
        logout,
        register, // Añadimos la función de registro
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};