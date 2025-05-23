import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { Ionicons } from '@expo/vector-icons'; // Importa los iconos de Expo

export default function LoginScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
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
          Usuario <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Usuario"
          value={usuario}
          onChangeText={setUsuario}
          autoCapitalize="none"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Contraseña <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword} // Cambia según el estado
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#757575"
            />
          </TouchableOpacity>
        </View>
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
        <TouchableOpacity
          style={[styles.button, styles.buttonRed]}
          onPress={handleCancel}
        >
          <Text style={styles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.requiredNote}>* Campo requerido</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  required: {
    color: '#e53935',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  // Nuevos estilos para el campo de contraseña
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
    marginRight: 2,
  },
  buttonContainer: {
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  buttonGreen: {
    backgroundColor: '#4caf50',
  },
  buttonRed: {
    backgroundColor: '#e57373',
  },
  buttonDisabled: {
    backgroundColor: '#bdbdbd',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  requiredNote: {
    marginTop: 18,
    color: '#e53935',
    fontSize: 13,
    textAlign: 'right',
  },
});