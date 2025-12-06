import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';

const BASE_URL = 'http://api.agrieldo.com/api/cooperatives';

// ---------------- AUTH HEADERS ----------------
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

const ManagerFarmersScreen = ({route, navigation}) => {
  const coopId = route.params?.coopId;
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchFarmers = async () => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();
      const res = await axios.get(`${BASE_URL}/farmers/${coopId}/`, headers);
      setFarmers(res.data);
    } catch (error) {
      console.log('Farmers load error:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmers();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchFarmers();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#ffa500" style={{marginTop: 40}} />
    );
  }

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('FarmerMilkSummaryScreen', {
          farmerId: item.id,
          coopId: coopId,
        })
      }>
      <View style={styles.row}>
        <Ionicons name="person-circle-outline" size={40} color="#ffa500" />

        <View style={{marginLeft: 12}}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phone_number}</Text>
        </View>
      </View>

      <View style={{marginTop: 10}}>
        <Text style={styles.label}>
          Monthly Milk: <Text style={styles.value}>{item.total_monthly} L</Text>
        </Text>
        <Text style={styles.label}>
          Last Delivery:{' '}
          <Text style={styles.value}>{item.last_delivery || 'No Record'}</Text>
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={farmers}
      keyExtractor={item => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{padding: 15}}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    />
  );
};

export default ManagerFarmersScreen;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 18,
    marginBottom: 15,
    borderRadius: 12,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#333',
  },
  phone: {
    fontSize: 14,
    color: '#666',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
  value: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
