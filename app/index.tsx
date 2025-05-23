import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Home from '../app/home';
import { useAuth } from '@/contexts/auth-context';

export default function HomeScreen() {

  const { user, isLoggedIn } = useAuth();

  return (
    <View style={styles.container}>
      {isLoggedIn && (
        <Text style={styles.title}>Bienvenido: {user?.username}</Text>
      )}
      <Home />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 48,
    textAlign: 'center',
  },
});