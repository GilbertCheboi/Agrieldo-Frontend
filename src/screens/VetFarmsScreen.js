// File: src/screens/VetFarmsScreen.js

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';
import styles from '../assets/styles/FarmListStyles';

const VetFarmsScreen = ({navigation}) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchVetFarms = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(
        'http://api.agrieldo.com/api/farms/vet/farms/',
        {
          headers: {Authorization: `Bearer ${token}`},
        },
      );
      setFarms(response.data);
    } catch (error) {
      console.error('❌ Error fetching vet farms:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchVetFarms();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchVetFarms();
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FarmDashboard', {farmId: item.id})}>
      <View style={styles.cardHeader}>
        <Text style={styles.farmName}>{item.name}</Text>
        <Icon name="chevron-right" size={22} color="#888" />
      </View>
      <Text style={styles.farmType}>Type: {item.type}</Text>
      <Text style={styles.farmOwner}>Owner: {item.owner}</Text>
      <Text style={styles.farmLocation}>
        📍 {item.location || 'Location not set'}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );
  }

  if (!farms.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyText}>No farms assigned to you yet.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={farms}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      contentContainerStyle={styles.listContainer}
    />
  );
};

export default VetFarmsScreen;
