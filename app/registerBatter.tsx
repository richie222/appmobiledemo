// app/registerBatter.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/auth-context';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { Ionicons } from '@expo/vector-icons'; // Importar iconos
import styles from './styles';

export default function RegisterBatterScreen() {
  
  useAuthGuard();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar contraseña
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Estado para mostrar/ocultar confirmación
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { register } = useAuth();
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Validar username
    if (!username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    } else if (username.length < 3) {
      newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
    }
    
    // Validar email
    if (!email.trim()) {
      newErrors.email = 'El correo electrónico es obligatorio';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    // Validar password
    if (!password) {
      newErrors.password = 'La contraseña es obligatoria';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    // Validar confirmación de password
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await register({
        username,
        email,
        password,
      });
      
      Alert.alert(
        'Registro exitoso',
        'El jugador ha sido registrado correctamente',
        [
          { 
            text: 'OK', 
            onPress: () => router.dismissTo('/')
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Error al registrar el jugador'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Jugador</Text>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Nombre de usuario <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.username ? styles.inputError : null]}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholder="Usuario"
        />
        {errors.username ? <Text style={styles.errorText}>{errors.username}</Text> : null}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Correo electrónico <Text style={styles.required}>*</Text></Text>
        <TextInput
          style={[styles.input, errors.email ? styles.inputError : null]}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="Correo electrónico"
        />
        {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Contraseña <Text style={styles.required}>*</Text></Text>
        <View style={[styles.passwordContainer, errors.password ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            placeholder="Contraseña"
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
        {errors.password ? <Text style={styles.errorText}>{errors.password}</Text> : null}
      </View>
      
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirmar contraseña <Text style={styles.required}>*</Text></Text>
        <View style={[styles.passwordContainer, errors.confirmPassword ? styles.inputError : null]}>
          <TextInput
            style={styles.passwordInput}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
            placeholder="Contraseña"
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#757575"
            />
          </TouchableOpacity>
        </View>
        {errors.confirmPassword ? <Text style={styles.errorText}>{errors.confirmPassword}</Text> : null}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.buttonGreen]}
          onPress={handleRegister}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Registrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}