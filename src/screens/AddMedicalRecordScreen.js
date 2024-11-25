import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const AddMedicalRecordScreen = ({ route, navigation }) => {
  const { animalId } = route.params;  // Get the animal ID from route params
  const [date, setDate] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');

  const handleSubmit = async () => {
    try {
      await axios.post(`http://localhost:8000/api/animals/${animalId}/add_medical_record/`, {
        date,
        diagnosis,
        treatment,
      });
      Alert.alert('Success', 'Medical record added');
      navigation.goBack();  // Go back to the previous screen
    } catch (error) {
      Alert.alert('Error', 'Failed to add medical record');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Date:</Text>
      <TextInput
        style={styles.input}
        value={date}
        onChangeText={setDate}
        placeholder="Enter date"
      />
      <Text>Diagnosis:</Text>
      <TextInput
        style={styles.input}
        value={diagnosis}
        onChangeText={setDiagnosis}
        placeholder="Enter diagnosis"
      />
      <Text>Treatment:</Text>
      <TextInput
        style={styles.input}
        value={treatment}
        onChangeText={setTreatment}
        placeholder="Enter treatment"
      />
      <Button title="Add Record" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 16,
  },
});

export default AddMedicalRecordScreen;
