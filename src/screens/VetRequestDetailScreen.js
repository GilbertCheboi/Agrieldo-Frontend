import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Modal, TextInput, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

const VetRequestDetailScreen = ({ route }) => {
  const { requestId } = route.params; // Get the request ID from the params
  const [vetRequest, setVetRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState('');

  useEffect(() => {
    const fetchVetRequest = async () => {
      try {
        const response = await axios.get(`YOUR_API_ENDPOINT/vet-requests/${requestId}`);
        setVetRequest(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load vet request');
        setLoading(false);
      }
    };

    fetchVetRequest();
  }, [requestId]);

  const handleSubmitMedicalHistory = async () => {
    if (medicalHistory.trim() === '') {
      Alert.alert('Error', 'Medical history cannot be empty.');
      return;
    }

    try {
      // Assuming your API supports a POST request to update medical history
      await axios.post(`YOUR_API_ENDPOINT/vet-requests/${requestId}/medical-history`, {
        medical_history: medicalHistory,
      });
      Alert.alert('Success', 'Medical history updated successfully.');
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update medical history.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vet Request Detail</Text>
      <Text style={styles.label}>Animal Name: {vetRequest.animal.name}</Text>
      <Text style={styles.label}>Species: {vetRequest.animal.species}</Text>
      <Text style={styles.label}>Description: {vetRequest.description}</Text>
      <Text style={styles.label}>Location: {vetRequest.location}</Text>
      <Text style={styles.label}>Status: {vetRequest.status}</Text>
      <Text style={styles.label}>Request Date: {new Date(vetRequest.request_date).toLocaleString()}</Text>

      {vetRequest.status === 'accepted' && (
        <Button
          title="Update Medical History"
          onPress={() => setModalVisible(true)} // Show modal when the button is pressed
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Update Medical History</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter medical history"
              value={medicalHistory}
              onChangeText={setMedicalHistory}
              multiline
            />
            <Button title="Submit" onPress={handleSubmitMedicalHistory} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  loader: {
    marginTop: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    textAlignVertical: 'top',
  },
});

export default VetRequestDetailScreen;
