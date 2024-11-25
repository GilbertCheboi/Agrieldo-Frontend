import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput, Alert, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const VetRequestScreen = () => {
  // Dummy farm data directly in the component
  const farmData = {
    animals: [
      { id: '1', name: 'Bessie', species: 'Cow' },
      { id: '2', name: 'Dolly', species: 'Sheep' },
      { id: '3', name: 'Cluckers', species: 'Chicken' },
      { id: '4', name: 'Billy', species: 'Goat' },
      { id: '5', name: 'Mittens', species: 'Cat' },
      { id: '6', name: 'Rover', species: 'Dog' },
    ],
  };

  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);

  const handleRequestSubmit = async () => {
    if (!location) {
      Alert.alert('Error', 'Please provide your location.');
      return;
    }

    try {
      const response = await fetch('http://your-backend-url/api/vet_requests/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourToken}`, // Replace with your token
        },
        body: JSON.stringify({
          animal: selectedAnimal,
          description: problemDescription,
          location: location,
          is_urgent: isUrgent,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Your vet request has been submitted.');
        setSelectedAnimal('');
        setProblemDescription('');
        setLocation('');
        setIsUrgent(false);
      } else {
        Alert.alert('Error', data.detail || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please check your connection.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Request a Vet</Text>

      {/* Animal Dropdown */}
      <Text>Select the Animal with the Problem:</Text>
      <Picker
        selectedValue={selectedAnimal}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedAnimal(itemValue)}
      >
        <Picker.Item label="Select an Animal" value="" />
        {farmData.animals.map((animal) => (
          <Picker.Item
            key={animal.id}
            label={`${animal.name} (${animal.species})`}
            value={animal.id}
          />
        ))}
      </Picker>

      {/* Problem Description */}
      <TextInput
        style={styles.input}
        placeholder="Describe the problem"
        value={problemDescription}
        onChangeText={setProblemDescription}
        multiline
      />

      {/* Location Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter your location"
        value={location}
        onChangeText={setLocation}
      />

      {/* Urgent Switch */}
      <View style={styles.switchContainer}>
        <Text>Is this urgent?</Text>
        <Switch
          value={isUrgent}
          onValueChange={setIsUrgent}
        />
      </View>

      {/* Submit Request Button */}
      <Button
        title="Submit Vet Request"
        onPress={handleRequestSubmit}
        disabled={!selectedAnimal || !problemDescription || !location}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default VetRequestScreen;
