import React, {useEffect, useState} from 'react';
import {View, Text, Button, Alert} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import WebSocket from 'ws';

const DashboardScreen = () => {
  const [location, setLocation] = useState(null);
  const [vets, setVets] = useState([]);
  const [vetId, setVetId] = useState('YOUR_VET_ID'); // Replace with the actual vet ID
  const socket = new WebSocket('ws://104.248.23.245/ws/vet-requests/'); // Replace with your WebSocket URL

  useEffect(() => {
    // Request user's location
    Geolocation.getCurrentPosition(
      position => {
        const {latitude, longitude} = position.coords;
        setLocation({latitude, longitude});
        updateVetLocation(vetId, latitude, longitude); // Update vet's location
      },
      error => Alert.alert('Location Error', error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );

    // Fetch available vets
    fetchAvailableVets();

    // WebSocket connection
    socket.onopen = () => {
      console.log('Connected to WebSocket');
    };

    socket.onmessage = event => {
      const message = JSON.parse(event.data);
      console.log('WebSocket message received:', message);
      // Handle incoming WebSocket messages here
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      socket.close();
    };
  }, []);

  const fetchAvailableVets = async () => {
    try {
      const response = await fetch(
        'https://api.agrieldo.com/api/profiles/vets/',
      );

      console.log('Response status:', response.status); // Log status code

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (response.ok && isJson) {
        const data = await response.json();
        console.log('Fetched vets data:', data); // Log JSON response
        setVets(data);
      } else {
        const text = await response.text(); // In case it's HTML or error
        console.error('Non-JSON response or error:', text);
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
      const response = await fetch(
        'http://104.248.23.245:8000/api/vet_requests/requests/create/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            location: location,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        Alert.alert(
          'Request sent',
          `Vet request successful. Vet ID: ${data.vet_id}`,
        );
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to send request.');
      }
    } catch (error) {
      console.error('Error requesting vet:', error);
    }
  };

  const updateVetLocation = async (vetId, latitude, longitude) => {
    try {
      const response = await fetch(
        `http://YOUR_BACKEND_URL/api/vet/${vetId}/location/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
          }),
        },
      );

      if (response.ok) {
        console.log('Vet location updated successfully');
      } else {
        const errorData = await response.json();
        console.error('Failed to update location:', errorData.error);
      }
    } catch (error) {
      console.error('Error updating vet location:', error);
    }
  };

  return (
    <View style={{flex: 1}}>
      {location && (
        <MapView
          style={{flex: 1}}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}>
          <Marker coordinate={location} title="Your Location" />

          {vets.map(vet => (
            <Marker
              key={vet.id}
              coordinate={{latitude: vet.latitude, longitude: vet.longitude}}
              title={vet.name}
            />
          ))}
        </MapView>
      )}
      <Button title="Request Vet" onPress={requestVet} />
    </View>
  );
};

export default DashboardScreen;
