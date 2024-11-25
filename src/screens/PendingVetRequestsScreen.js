// PendingVetRequestsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, ActivityIndicator } from 'react-native';

const PendingVetRequestsScreen = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const response = await fetch('YOUR_API_URL/api/vet_requests/?status=pending'); // Adjust URL for pending requests
      const data = await response.json();
      setPendingRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching pending vet requests:', error);
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId, action) => {
    try {
      const response = await fetch(`YOUR_API_URL/api/vet_requests/${requestId}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: action }), // action can be 'accepted' or 'rejected'
      });
      
      if (response.ok) {
        fetchPendingRequests(); // Refresh the list after updating
      } else {
        console.error('Error updating request:', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestContainer}>
      <Text style={styles.requestTitle}>Request for {item.animal.name} ({item.animal.species})</Text>
      <Text>Description: {item.description}</Text>
      <Text>Location: {item.location}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Date & Time: {new Date(item.request_date).toLocaleString()}</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Accept"
          onPress={() => handleRequestResponse(item.id, 'accepted')}
          disabled={item.status !== 'pending'} // Only allow if request is pending
        />
        <Button
          title="Reject"
          onPress={() => handleRequestResponse(item.id, 'rejected')}
          disabled={item.status !== 'pending'} // Only allow if request is pending
        />
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={pendingRequests}
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
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default PendingVetRequestsScreen;
