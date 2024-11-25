// src/screens/ListGoatsScreen.js
import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const goats = [
  { id: '1', name: 'Goat 1', age: 3, breed: 'Boer' },
  { id: '2', name: 'Goat 2', age: 2, breed: 'Kiko' },
  // Add more goat data
];

const ListGoatsScreen = () => {
  const renderGoat = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.title}>{item.name}</Text>
      <Text>Age: {item.age}</Text>
      <Text>Breed: {item.breed}</Text>
    </View>
  );

  return (
    <FlatList
      data={goats}
      renderItem={renderGoat}
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

export default ListGoatsScreen;
