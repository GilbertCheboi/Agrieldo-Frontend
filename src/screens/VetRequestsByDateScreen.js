// VetRequestsByDateScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';

const VetRequestsByDateScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequestsByDate = async (date) => {
    try {
      const response = await fetch(`YOUR_API_URL/api/vet_requests/?request_date=${date}`); // Adjust your API URL
      const data = await response.json();
      setRequests(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching requests by date:', error);
      setLoading(false);
    }
  };

  const onDayPress = (day) => {
    const date = day.dateString;
    setSelectedDate(date);
    fetchRequestsByDate(date); // Fetch requests for the selected date
  };

  const renderRequestItem = ({ item }) => (
    <View style={styles.requestContainer}>
      <Text style={styles.requestTitle}>Request for {item.animal.name} ({item.animal.species})</Text>
      <Text>Description: {item.description}</Text>
      <Text>Location: {item.location}</Text>
      <Text>Status: {item.status}</Text>
      <Text>Date & Time: {new Date(item.request_date).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Date to View Vet Requests</Text>
      <Calendar
        onDayPress={onDayPress}
        markedDates={{ [selectedDate]: { selected: true, marked: true, dotColor: 'red' } }}
      />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={requests}
          renderItem={renderRequestItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  requestContainer: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  listContainer: {
    paddingTop: 20,
  },
});

export default VetRequestsByDateScreen;
