import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import styles from './styles';

export default function LoginScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const camposLlenos = usuario.trim() !== '' && password.trim() !== '';
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

const handleLogin = async () => {
    if (!usuario || !password) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }

    setIsLoading(true);
    try {
      await login(usuario, password);
      router.dismissTo('/')
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.dismissTo('/')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Usuario<Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Usuario o correo"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Contraseña <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.buttonGreen,
            !camposLlenos && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!camposLlenos || isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Cargando...' : 'Entrar'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.requiredNote}>* Campo requerido</Text>
    </View>
  );
}