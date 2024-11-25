import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, FlatList } from 'react-native';

const AddMilkProduction = () => {
  const [animalId, setAnimalId] = useState('');
  const [milkingTime, setMilkingTime] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddProduction = () => {
    // Here you would typically add the new record to the database or state
    console.log({ animalId, milkingTime, amount });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Milk Production Record</Text>
      <TextInput
        placeholder="Animal ID"
        value={animalId}
        onChangeText={setAnimalId}
        style={styles.input}
      />
      <TextInput
        placeholder="Milking Time (YYYY-MM-DDTHH:MM:SSZ)"
        value={milkingTime}
        onChangeText={setMilkingTime}
        style={styles.input}
      />
      <TextInput
        placeholder="Amount (Liters)"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
        keyboardType="numeric"
      />
      <Button title="Add Record" onPress={handleAddProduction} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
  },
});

export default AddMilkProduction;
