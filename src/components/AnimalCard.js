// components/AnimalCard.js
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const AnimalCard = ({animal}) => (
  <View style={styles.card}>
    <Text style={styles.name}>{animal.name}</Text>
    <Text>Tag: {animal.tag}</Text>
    <Text>Breed: {animal.breed}</Text>
    <Text>Gender: {animal.gender}</Text>
    <Text>Category: {animal.category}</Text>
    <Text>DOB: {animal.dob}</Text>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#1a3c34',
  },
});

export default AnimalCard;
