import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';

const categorias = [
  { nombre: 'Restaurantes', emoji: '🍽️' },
  { nombre: 'Hoteles', emoji: '🏨' },
  { nombre: 'Compras', emoji: '🛍️' },
  { nombre: 'Vida nocturna', emoji: '🌃' },
  { nombre: 'Parques', emoji: '🏞️' },
  { nombre: 'Museos', emoji: '🖼️' },
  { nombre: 'Transporte', emoji: '🚌' },
  { nombre: 'Cultura y tradiciones', emoji: '🎭' },
];

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth / 2 - 20;

export default function Categorias() {
  const renderItem = ({ item }) => (
    <View style={[styles.card, { width: itemWidth }]}>
      <Text style={styles.emoji}>{item.emoji}</Text>
      <Text style={styles.nombre}>{item.nombre}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Categorías</Text>
      <FlatList
        data={categorias}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingTop: 40,
    backgroundColor: '#fff',
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  grid: {
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#e0e0e0',
    borderRadius: 12,
    padding: 20,
    margin: 8,
    alignItems: 'center',
    elevation: 3, // para sombra en Android
  },
  emoji: {
    fontSize: 30,
    marginBottom: 8,
  },
  nombre: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});

