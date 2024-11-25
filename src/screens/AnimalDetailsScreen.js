import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';

const axiosInstance = axios.create({
  baseURL: 'http://104.248.23.245/',
});

// Function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decodedToken = jwt_decode(token);
    return decodedToken.exp * 1000 < Date.now();
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// Function to refresh access token
const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refresh_token');
  try {
    const response = await axios.post('http://104.248.23.245/api/accounts/api/token/refresh/', {
      refresh: refreshToken,
    });
    await AsyncStorage.setItem('access_token', response.data.access);
    return response.data.access;
  } catch (error) {
    console.error('Failed to refresh token:', error);
    throw error;
  }
};

// Axios request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem('access_token');
    if (isTokenExpired(token)) {
      token = await refreshAccessToken();
    }
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AnimalDetailsScreen = () => {
  const route = useRoute();
  const { animalId } = route.params;

  const [animalDetails, setAnimalDetails] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimalDetails = async () => {
      try {
        const animalResponse = await axiosInstance.get(`api/animals/dairy-cows/${animalId}/`);
        setAnimalDetails(animalResponse.data);

        const historyResponse = await axiosInstance.get(`api/animals/dairy-cows/${animalId}/medical-records/`);
        setMedicalHistory(historyResponse.data);
      } catch (error) {
        console.error('Failed to fetch animal details or medical history:', error);
        Alert.alert('Error', 'Failed to fetch animal details or medical history');
      } finally {
        setLoading(false);
      }
    };

    fetchAnimalDetails();
  }, [animalId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );
  }

  if (!animalDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No details available for this animal.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {animalDetails.image && (
        <Image source={{ uri: animalDetails.image }} style={styles.animalImage} />
      )}
      <Text style={styles.animalName}>{animalDetails.name}</Text>
      <Text style={styles.detailText}>Species: {animalDetails.species}</Text>
      <Text style={styles.detailText}>Age: {animalDetails.age}</Text>
      <Text style={styles.detailText}>Gender: {animalDetails.gender === 'M' ? 'Male' : 'Female'}</Text>

      {/* Medical History Section */}
      <Text style={styles.sectionTitle}>Medical History</Text>
      {medicalHistory.length > 0 ? (
        medicalHistory.map((record) => (
          <View key={record.id} style={styles.medicalRecord}>
            <Text style={styles.recordText}>Date: {record.date}</Text>
            <Text style={styles.recordText}>Treatment: {record.treatment}</Text>
            <Text style={styles.recordText}>Vet: {record.vet}</Text>
            <Text style={styles.recordText}>Notes: {record.notes}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noHistoryText}>No medical history available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animalImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
  },
  animalName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  detailText: {
    fontSize: 18,
    marginBottom: 5,
    color: '#555',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#333',
  },
  medicalRecord: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    width: '100%',
  },
  recordText: {
    fontSize: 16,
    color: '#555',
  },
  noHistoryText: {
    fontSize: 16,
    color: 'red',
  },
});

export default AnimalDetailsScreen;
