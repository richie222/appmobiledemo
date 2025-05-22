// app/index.jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Home from '../app/home'; // Importa el componente

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenidos</Text>
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