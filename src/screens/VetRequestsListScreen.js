import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import Video from 'react-native-video';  // Import Video component


// Set up axios instance
const axiosInstance = axios.create({
  baseURL: 'http://104.248.23.245/', // Ensure this is your correct base URL
});

// Function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true; // If there's no token, consider it expired
  try {
    const decodedToken = jwt_decode(token); // Decode the token
    return decodedToken.exp * 1000 < Date.now(); // Check expiry
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Treat as expired if there's an error
  }
};

// Function to refresh access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = await AsyncStorage.getItem('refresh_token');
    const response = await axios.post('http://104.248.23.245/api/accounts/api/token/refresh/', {
      refresh: refreshToken,
    });

    // Store the new access token
    await AsyncStorage.setItem('access_token', response.data.access);
    return response.data.access; // Return the new access token
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Axios request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem('access_token');

    // Check if the token is expired
    if (isTokenExpired(token)) {
      token = await refreshAccessToken(); // Get new token
    }

    // Add Authorization header
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const VetRequestListScreen = () => {
  const [vetRequests, setVetRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = React.useState(false);


  useEffect(() => {
    fetchVetRequests();
  }, []);

  const fetchVetRequests = async () => {
    try {
      const response = await axiosInstance.get('api/vet_requests/requests/');
      console.log('API Response:', response.data); // Log the response data to the console

      setVetRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch vet requests:', error);
      Alert.alert('Error', 'Failed to fetch vet requests');
      setLoading(false);
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestContainer}>
      {/* Conditionally render the image only if it's available */}
      {item.image ? (
        <Image 
          source={{ uri: item.image }}  // Use the animal's image URI
          style={styles.animalMedia}            // Apply styles for the image
        />
      ) : null}

      {/* Conditionally render the video only if it's available */}
      {item.video ? (
        <Video
          source={{ uri: item.video }}  // Use the animal's video URI
          style={styles.animalMedia}            // Apply styles for the video
          controls                              // Add video controls
          resizeMode="contain"                  // Resize the video to fit
          repeat                                // Loop the video
        />
      ) : null}

      {/* Animal details and request info */}
      <Text style={styles.requestTitle}>
        Request for {item.animal_details.name} ({item.animal_details.species}) ({item.animal_details.tag})
      </Text>
      <Text>Description: {item.description}</Text>
      <Text>Location: {item.location}</Text>
      <Text>Urgent: {item.is_urgent ? 'Yes' : 'No'}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Date & Time: {new Date(item.request_date).toLocaleString()}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={vetRequests}
      renderItem={renderRequestItem}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  requestContainer: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  animalMedia: {
    width: '100%',        // Set the width of the media (image/video)
    height: 200,          // Set the height of the media
    marginBottom: 10,     // Add space between the media and text
    borderRadius: 0,      // Ensure no rounded corners
  },
});

export default VetRequestListScreen;
