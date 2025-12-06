import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';

const BASE_URL = 'http://api.agrieldo.com/api/cooperatives';

// Load Bearer token
const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

const ManagerDashboardScreen = ({route}) => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [stats, setStats] = useState({
    total_today: 0,
    total_am: 0,
    total_pm: 0,
    farmers_count: 0,
  });

  const coopId = route.params?.coopId;

  const formatDate = d => d.toISOString().split('T')[0];

  const loadDashboard = async (date = selectedDate) => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();

      const res = await axios.get(
        `${BASE_URL}/dashboard/${coopId}/?date=${formatDate(date)}`,
        headers,
      );

      setStats(res.data);
    } catch (error) {
      console.log('Dashboard Error:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboard();
    setRefreshing(false);
  };

  const onChangeDate = (event, date) => {
    setShowPicker(false);
    if (date) {
      setSelectedDate(date);
      loadDashboard(date);
    }
  };

  if (loading)
    return (
      <ActivityIndicator size="large" color="#ffa500" style={{marginTop: 40}} />
    );

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <Text style={styles.header}>Cooperative Dashboard</Text>

      {/* DATE PICKER BUTTON */}
      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowPicker(true)}>
        <Ionicons name="calendar-outline" size={20} color="#ffa500" />
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="calendar"
          onChange={onChangeDate}
        />
      )}

      {/* TOTAL TODAY */}
      <View style={styles.card}>
        <Ionicons name="water-outline" size={35} color="#ffa500" />
        <View>
          <Text style={styles.cardValue}>{stats.total_today} L</Text>
          <Text style={styles.cardLabel}>Total Milk</Text>
        </View>
      </View>

      {/* AM & PM SPLIT */}
      <View style={styles.row}>
        <View style={styles.smallCard}>
          <Ionicons name="sunny-outline" size={26} color="#ffa500" />
          <Text style={styles.smallValue}>{stats.total_am} L</Text>
          <Text style={styles.smallLabel}>Morning</Text>
        </View>

        <View style={styles.smallCard}>
          <Ionicons name="moon-outline" size={26} color="#ffa500" />
          <Text style={styles.smallValue}>{stats.total_pm} L</Text>
          <Text style={styles.smallLabel}>Evening</Text>
        </View>
      </View>

      {/* FARMERS */}
      <View style={styles.card}>
        <Ionicons name="people-outline" size={35} color="#ffa500" />
        <View>
          <Text style={styles.cardValue}>{stats.farmers_count}</Text>
          <Text style={styles.cardLabel}>Active Farmers</Text>
        </View>
      </View>

      {/* AI Insight */}
      <View style={styles.aiCard}>
        <Text style={styles.aiTitle}>AI Insight</Text>
        <Text style={styles.aiText}>
          Milk production has been stable this week. No unusual drops detected.
        </Text>
      </View>
    </ScrollView>
  );
};

export default ManagerDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f6f6f6',
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 2,
  },
  cardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#333',
  },
  cardLabel: {
    fontSize: 13,
    marginLeft: 15,
    color: '#666',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  smallCard: {
    backgroundColor: '#fff',
    width: '48%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    marginBottom: 15,
  },

  smallValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 8,
    color: '#333', // ← ADD THIS
  },

  smallLabel: {
    fontSize: 14,
    marginTop: 3,
    color: '#777', // ← ADD THIS
  },

  aiCard: {
    backgroundColor: '#333',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffa500',
    marginBottom: 10,
  },
  aiText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateText: {
    color: '#ffa500',
    fontSize: 16,
    marginLeft: 10,
  },
});
