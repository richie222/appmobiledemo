import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [usuario, setUsuario] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const camposLlenos = usuario.trim() !== '' && password.trim() !== '';

  const handleLogin = () => {
    // Aquí va la lógica de autenticación
    Alert.alert('Login', `Usuario: ${usuario}`);
    // router.replace('/home');
  };

  const handleCancel = () => {
    router.dismissTo('/')
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sesión</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Usuario o Correo <Text style={styles.required}>*</Text>
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
          disabled={!camposLlenos}
        >
          <Text style={styles.buttonText}>Entrar</Text>
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