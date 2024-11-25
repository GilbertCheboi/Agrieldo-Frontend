import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';

const MedicalRecordsListScreen = ({ route }) => {
  const { animalId } = route.params;  // Get the animal ID from route params
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/animals/${animalId}/medical_records/`);
        setRecords(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, [animalId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={records}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.record}>
            <Text>Date: {item.date}</Text>
            <Text>Diagnosis: {item.diagnosis}</Text>
            <Text>Treatment: {item.treatment}</Text>
            <Text>Veterinarian: {item.veterinarian}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  record: {
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
  },
});

export default MedicalRecordsListScreen;
