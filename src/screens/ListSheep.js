// src/screens/ListSheepScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const sheep = [
  { id: '1', name: 'Sheep 1', age: 1, breed: 'Merino' },
  { id: '2', name: 'Sheep 2', age: 4, breed: 'Dorset' },
  // Add more sheep data
];

const ListSheepScreen = () => {
  const renderSheep = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Age: {item.age}</Text>
      <Text>Breed: {item.breed}</Text>
    </View>
  );

  return (
    <FlatList
      data={sheep}
      renderItem={renderSheep}
      keyExtractor={item => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  itemContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ListSheepScreen;
