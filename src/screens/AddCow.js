// src/screens/AddCowScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

const AddCowScreen = ({ navigation }) => {
  const [cowName, setCowName] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');

  const handleAddCow = () => {
    // Logic to handle adding a cow (e.g., API call)
    console.log('Adding cow:', { cowName, age, breed });
    // Navigate back or show success message
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a Cow</Text>
      <TextInput
        style={styles.input}
        placeholder="Cow Name"
        value={cowName}
        onChangeText={setCowName}
      />
      <TextInput
        style={styles.input}
        placeholder="Age"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />
      <TextInput
        style={styles.input}
        placeholder="Breed"
        value={breed}
        onChangeText={setBreed}
      />
      <Button title="Add Cow" onPress={handleAddCow} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default AddCowScreen;
