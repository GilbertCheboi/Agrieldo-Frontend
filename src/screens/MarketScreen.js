import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';

const MarketScreen = () => {
  // Dummy data for animals on sale
  const [animals, setAnimals] = useState([
    { id: '1', name: 'Bessie', species: 'Cow', price: 1500 },
    { id: '2', name: 'Dolly', species: 'Sheep', price: 300 },
    { id: '3', name: 'Cluckers', species: 'Chicken', price: 20 },
    { id: '4', name: 'Billy', species: 'Goat', price: 250 },
    { id: '5', name: 'Mittens', species: 'Cat', price: 100 },
    { id: '6', name: 'Rover', species: 'Dog', price: 200 },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newAnimal, setNewAnimal] = useState({ name: '', species: '', price: '' });

  const handleAnimalPress = (animal) => {
    Alert.alert('Animal Selected', `You selected ${animal.name} (${animal.species}). Price: $${animal.price}`);
    // Add functionality for viewing more details or purchasing
  };

  const handleAddAnimal = () => {
    if (newAnimal.name && newAnimal.species && newAnimal.price) {
      setAnimals((prevAnimals) => [
        ...prevAnimals,
        { id: (animals.length + 1).toString(), ...newAnimal },
      ]);
      setModalVisible(false); // Close the modal
      setNewAnimal({ name: '', species: '', price: '' }); // Clear the form
    } else {
      Alert.alert('Invalid Input', 'Please fill in all fields');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Market</Text>
      <FlatList
        data={animals}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => handleAnimalPress(item)}>
            <Text style={styles.animalName}>{item.name}</Text>
            <Text style={styles.animalSpecies}>{item.species}</Text>
            <Text style={styles.price}>${item.price}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      <Button title="Add Item" onPress={() => setModalVisible(true)} color="#ffa500" />

      {/* Modal for adding an animal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add Animal</Text>
            <TextInput
              style={styles.input}
              placeholder="Animal Name"
              value={newAnimal.name}
              onChangeText={(text) => setNewAnimal({ ...newAnimal, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Species"
              value={newAnimal.species}
              onChangeText={(text) => setNewAnimal({ ...newAnimal, species: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={newAnimal.price}
              onChangeText={(text) => setNewAnimal({ ...newAnimal, price: text })}
              keyboardType="numeric"
            />
            <Button title="Add Animal" onPress={handleAddAnimal} color="#ffa500" />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f8f8', // Lighter background for better contrast
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#333', // Dark text for better visibility
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd', // Lighter border
    backgroundColor: '#fff', // White background for items
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: '#000', // Adding a shadow for visual depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  animalName: {
    fontWeight: 'bold',
    fontSize: 20,
    color: '#333', // Darker text color
  },
  animalSpecies: {
    fontSize: 16,
    color: '#555', // Slightly lighter text for species
  },
  price: {
    color: 'green',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark background for modal
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ddd', // Light border color
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9', // Lighter background for inputs
  },
});

export default MarketScreen;
