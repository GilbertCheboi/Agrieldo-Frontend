// File: src/screens/VetRequestScreen.js

import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const VetRequestScreen = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // Fetch the requests from the backend
    axios.get('http://192.168.100.4:8000/api/vet/requests')
      .then(response => setRequests(response.data))
      .catch(error => console.error(error));
  }, []);

  const handleAccept = (requestId) => {
    // Logic to accept a request
    console.log(`Accepted request ${requestId}`);
  };

  const handleDecline = (requestId) => {
    // Logic to decline a request
    console.log(`Declined request ${requestId}`);
  };

  const renderRequest = ({ item }) => (
    <View style={styles.requestItem}>
      <Text style={styles.requestText}>Request from: {item.farmerName}</Text>
      <Text style={styles.requestText}>Animal: {item.animal}</Text>
      <Text style={styles.requestText}>Issue: {item.issue}</Text>
      <View style={styles.buttonContainer}>
        <Button title="Accept" onPress={() => handleAccept(item.id)} />
        <Button title="Decline" onPress={() => handleDecline(item.id)} />
      </View>
    </View>
  );

  return (
    <FlatList
      data={requests}
      renderItem={renderRequest}
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
  requestItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  requestText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default VetRequestScreen;
