import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

interface RegisterScreenProps {}

export default function RegisterScreen({}: RegisterScreenProps) {
  const router = useRouter();
  const [alias, setAlias] = useState<string>('');
  const [correo, setCorreo] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const camposLlenos = alias.trim() !== '' && correo.trim() !== '' && password.trim() !== '';

  const handleRegister = () => {
    // Aquí puedes agregar la lógica para registrar el usuario
    Alert.alert('Registro', `Alias: ${alias}\nCorreo: ${correo}`);
    // Después de registrar, podrías navegar al home o a otra pantalla
    // router.replace('/home');
  };

  const handleCancel = () => {
    router.replace('/tabs'); // Asume que '/' es tu home
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Alias/Usuario <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Alias/Usuario"
          value={alias}
          onChangeText={setAlias}
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Correo <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Correo"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
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
          onPress={handleRegister}
          disabled={!camposLlenos}
        >
          <Text style={styles.buttonText}>Registrar</Text>
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