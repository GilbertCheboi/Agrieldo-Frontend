// src/screens/ListCowsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const cows = [
  { id: '1', name: 'Cow 1', age: 2, breed: 'Holstein' },
  { id: '2', name: 'Cow 2', age: 3, breed: 'Jersey' },
  // Add more cow data
];

const ListCowsScreen = () => {
  const renderCow = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Age: {item.age}</Text>
      <Text>Breed: {item.breed}</Text>
    </View>
  );

  return (
    <FlatList
      data={cows}
      renderItem={renderCow}
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

export default ListCowsScreen;
