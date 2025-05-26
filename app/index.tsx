import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Home from '../app/home';
import { useAuth } from '@/contexts/auth-context';
import styles from './styles';

export default function HomeScreen() {

  const { user, isLoggedIn } = useAuth();

  return (
    <View style={styles.containerIndex}>
      {isLoggedIn && (
        <Text style={styles.title}>Bienvenido: {user?.username}</Text>
      )}
      <Home />
    </View>
  );
}
