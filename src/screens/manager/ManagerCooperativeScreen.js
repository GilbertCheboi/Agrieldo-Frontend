import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* ------------------------------------
   INLINE API SETUP (NO EXTERNAL IMPORTS)
-------------------------------------- */

const API = axios.create({
  baseURL: 'http://api.agrieldo.com/api/',
  timeout: 10000,
});

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

const fetchCooperativeDetails = async coopId => {
  const headers = await getAuthHeaders();
  const response = await API.get(`cooperatives/details/${coopId}/`, headers);
  return response.data;
};

/* ------------------------------------
   MAIN SCREEN
-------------------------------------- */

const ManagerCooperativeScreen = ({route}) => {
  const coopId = route.params?.coopId;

  const [loading, setLoading] = useState(true);
  const [cooperative, setCooperative] = useState(null);
  const [members, setMembers] = useState([]);

  const loadData = async () => {
    try {
      setLoading(true);

      const data = await fetchCooperativeDetails(coopId);

      console.log('📦 RAW COOP DETAILS RESPONSE:', data);

      // support both backend formats
      const coop = data.cooperative || data;
      const mems = data.members || data.memberships || [];

      setCooperative(coop);
      setMembers(mems);
    } catch (error) {
      console.log(
        '❌ Error loading coop:',
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading || !cooperative) {
    return (
      <ActivityIndicator size="large" color="#ffa500" style={{marginTop: 50}} />
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{cooperative.name}</Text>
      <Text style={styles.subtitle}>Code: {cooperative.code}</Text>
      <Text style={styles.subtitle}>
        Location: {cooperative.location || 'N/A'}
      </Text>

      <Text style={styles.sectionTitle}>Members</Text>

      <FlatList
        data={members}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.memberCard}>
            <Ionicons name="person-circle-outline" size={32} color="#ffa500" />
            <View style={{marginLeft: 12}}>
              <Text style={styles.memberName}>
                {item.name || item.username}
              </Text>
              <Text style={styles.memberRole}>{item.role}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ManagerCooperativeScreen;

/* ------------------------------------
   STYLES
-------------------------------------- */

const styles = StyleSheet.create({
  container: {flex: 1, padding: 15, backgroundColor: '#f6f6f6'},
  title: {fontSize: 22, fontWeight: 'bold', color: '#333'},
  subtitle: {fontSize: 15, color: '#666', marginTop: 4},
  sectionTitle: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    elevation: 3,
  },
  memberName: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  memberRole: {fontSize: 14, color: '#555'},
});
