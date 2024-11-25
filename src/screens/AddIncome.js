import React from 'react';
import { View, Text, StyleSheet, TextInput, Button } from 'react-native';

const AddIncome = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Income</Text>
      <TextInput
        style={styles.input}
        placeholder="Income Source"
      />
      <TextInput
        style={styles.input}
        placeholder="Amount"
        keyboardType="numeric"
      />
      <Button title="Save Income" onPress={() => { /* Logic to save income */ }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
});

export default AddIncome;
