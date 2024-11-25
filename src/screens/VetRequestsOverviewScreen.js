import React, { useEffect, useState } from 'react';
import { View, Button, Alert, StyleSheet, Dimensions, Modal, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import CustomMarker from '../assets/medical.png'; // Adjust the path to your image
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const DashboardScreen = () => {
  const [location, setLocation] = useState(null);
  const [vets, setVets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [userId, setUserId] = useState(null);  // Store user ID for WebSocket connection
  const [socket, setSocket] = useState(null); // WebSocket connection
  const [socketReady, setSocketReady] = useState(false); // Track WebSocket readiness

  // Get user ID from token stored in AsyncStorage
  const getUserIdFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      if (token) {
        const decoded = jwtDecode(token);
        return decoded.user_id;
      }
    } catch (error) {
      console.error('Error retrieving token or decoding:', error);
    }
    return null;
  };

  // Set up WebSocket connection using the user ID
  const setupWebSocket = async (userId) => {
    if (userId) {
      const socketUrl = `ws://104.248.23.245:8000/ws/location/${userId}/`;
      console.log(`Attempting to connect to WebSocket at ${socketUrl}`);
  
      const newSocket = new WebSocket(socketUrl);
  
      // WebSocket open event handler
      newSocket.onopen = () => {
        console.log('WebSocket connected successfully');
        setSocketReady(true); // Mark WebSocket as ready when open
      };
  
      // WebSocket message event handler
      newSocket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message:', message);
      };
  
      // WebSocket error event handler
      newSocket.onerror = (error) => {
        console.error('WebSocket error:', error);  // Log any errors with the WebSocket
      };
  
      // WebSocket close event handler
      newSocket.onclose = (event) => {
        if (event.wasClean) {
          console.log('WebSocket closed cleanly');
        } else {
          console.warn('WebSocket closed unexpectedly');
        }
        setSocketReady(false); // Reset readiness on close
      };
  
      setSocket(newSocket);  // Save WebSocket reference for future use
    } else {
      console.log('No user ID available to set up WebSocket connection');
    }
  };
  

  
    // Fetch userId from token and set up WebSocket
    useEffect(() => {
      const initialize = async () => {
        try {
          const userId = await getUserIdFromToken();  // Assuming getUserIdFromToken is defined
          if (userId) {
            console.log('User ID fetched successfully:', userId);
            setUserId(userId);  // Set userId in state
            setupWebSocket(userId);  // Set up WebSocket connection only if userId is available
          } else {
            console.error('User ID not found. Unable to set up WebSocket connection.');
          }
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      };
  
      initialize();
  
      // Cleanup function to close WebSocket connection when component unmounts or userId changes
      return () => {
        if (socket) {
          socket.close();
          console.log('WebSocket connection closed during cleanup');
        }
      };
    }, [userId, socket]);  // Re-run effect when userId or socket changes
  
    // Function to send location data via WebSocket
    const sendLocationToWebSocket = (latitude, longitude) => {
      console.log('Trying to send location data:', { latitude, longitude });
  
      if (socketReady) {
        const locationData = { latitude, longitude };
        socket.send(JSON.stringify(locationData));  // Send location data to WebSocket
        console.log('Location data sent:', locationData);
      } else {
        console.log('WebSocket not open. Retrying to send data...');
        setTimeout(() => sendLocationToWebSocket(latitude, longitude), 1000);  // Retry sending after 1 second
      }
    };


  // Watch position and send location updates
  useEffect(() => {
    const watchId = Geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
        sendLocationToWebSocket(latitude, longitude);  // Send location to WebSocket
        fetchAvailableVets(latitude, longitude);  // Fetch nearby vets
      },
      (error) => {
        console.error('Location Error:', error);
        Alert.alert('Location Error', error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 1,  // Update the position every 1 meter
        interval: 1000,  // Get updates every second
        fastestInterval: 500,  // Fastest possible update interval (in milliseconds)
      }
    );

    return () => {
      Geolocation.clearWatch(watchId);  // Clear location watch on unmount
    };
  }, []);  // Empty array ensures this effect only runs once when component mounts

  const fetchAvailableVets = async (latitude, longitude) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch('http://104.248.23.245:8001/api/profiles/vets/available/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      if (response.ok) {
        const data = await response.json();
        setVets(data);
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.detail || 'Unable to fetch available vets.');
      }
    } catch (error) {
      console.error('Error fetching vets:', error);
    }
  };

  const requestVet = async () => {
    if (!location) {
      Alert.alert('Error', 'Location is required');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await fetch('http://104.248.23.245/api/vet_requests/request/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ location, description }),
      });

      if (response.ok) {
        const data = await response.json();
        Alert.alert('Request sent', `Vet request successful. Vet ID: ${data.vet_id}`);
        setModalVisible(false); // Close modal on success
        setDescription(''); // Reset description
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to send request.');
      }
    } catch (error) {
      console.error('Error requesting vet:', error);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}
        >
          <Marker coordinate={location} title="Your Location" />
          {vets.map((vet) => (
            <Marker
              key={vet.id}
              coordinate={{ latitude: vet.latitude, longitude: vet.longitude }}
              image={CustomMarker}
              style={{ width: 60, height: 60 }}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Button title="Fetching Location..." disabled />
        </View>
      )}

      {/* Request Vet Button */}
      <View style={styles.buttonContainer}>
        <Button title="Request Vet" onPress={() => setModalVisible(true)} />
      </View>

      {/* Modal for Requesting Vet */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Describe your issue"
              value={description}
              onChangeText={setDescription}
              style={styles.textInput}
              multiline={true}
            />
            <Button title="Submit Request" onPress={requestVet} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: Dimensions.get('window').height - 100, // Leave space for the button
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    color: '#ffa500',
    left: 20,
    right: 20,
    zIndex: 1000, // Ensure button is above the map
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffa500',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  textInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default DashboardScreen;
