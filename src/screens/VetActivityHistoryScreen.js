// File: src/screens/VetActivityHistoryScreen.js

import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import axios from 'axios';

const VetActivityHistoryScreen = () => {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    // Fetch the vet's activity history from the backend
    axios
      .get(' http://192.168.100.4:8000 /api/vet/activities')
      .then(response => setActivities(response.data))
      .catch(error => console.error(error));
  }, []);

  const renderActivity = ({item}) => (
    <View style={styles.activityItem}>
      <Text style={styles.activityText}>Date: {item.date}</Text>
      <Text style={styles.activityText}>Animal: {item.animal}</Text>
      <Text style={styles.activityText}>Action: {item.action}</Text>
    </View>
  );

  return (
    <FlatList
      data={activities}
      renderItem={renderActivity}
      keyExtractor={item => item.id.toString()}
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
  activityItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
  },
  activityText: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default VetActivityHistoryScreen;
