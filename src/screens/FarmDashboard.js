// File: src/screens/FarmDashboard.js

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Feather';

import styles from '../assets/styles/FarmDashboard.js'; // ⬅️ Import separated styles
import DairyDashboard from './DairyDashboard';

const FarmDashboard = ({route, navigation}) => {
  const {farmId} = route.params;

  console.log('🐮 FarmDashboard received farmId:', farmId);
  const [farm, setFarm] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchFarmDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(
        `http://api.agrieldo.com/api/farms/get_farms/${farmId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setFarm(response.data);
    } catch (error) {
      console.error('Error fetching farm:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmDetails();
  }, []);

  const renderDashboard = () => {
    if (!farm || !farm.type) return null;

    switch (farm.type) {
      case 'Dairy':
        return <DairyDashboard farmId={farmId} />;
      default:
        return (
          <View style={styles.unsupportedBox}>
            <Text style={styles.unsupportedText}>
              🚫 Dashboard for "{farm.type}" farm is not yet supported.
            </Text>
          </View>
        );
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );
  }

  if (!farm) {
    return (
      <View style={styles.center}>
        <Text style={{color: 'red'}}>Failed to load farm data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Compact Info Row */}
      <View style={styles.farmRow}>
        <Text style={styles.farmText}>{farm.name}</Text>
        <Text style={styles.farmText}>| {farm.type}</Text>
        <Text style={styles.farmText}>| {farm.owner}</Text>
      </View>

      {/* Dashboard */}
      {renderDashboard()}
    </ScrollView>
  );
};

export default FarmDashboard;
