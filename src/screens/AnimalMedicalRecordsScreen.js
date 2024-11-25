// File: src/screens/AnimalMedicalRecordsScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const AnimalMedicalRecordsScreen = ({ route }) => {
  const { animalId } = route.params;
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Fetch the medical records from the backend
    axios.get(`http://192.168.100.4:8000/api/animals/${animalId}/medical-records`)
      .then(response => setRecords(response.data))
      .catch(error => console.error(error));
  }, [animalId]);

  const renderRecord = ({ item }) => (
    <View style={styles.recordItem}>
      <Text style={styles.recordText}>Date: {item.date}</Text>
      <Text style={styles.recordText}>Diagnosis: {item.diagnosis}</Text>
      <Text style={styles.recordText}>Treatment: {item.treatment}</Text>
    </View>
  );

  return (
    <FlatList
      data={records}
      renderItem={renderRecord}
      keyExtractor={(item) => item.id.toString()}
      style={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  recordItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  recordText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default AnimalMedicalRecordsScreen;
