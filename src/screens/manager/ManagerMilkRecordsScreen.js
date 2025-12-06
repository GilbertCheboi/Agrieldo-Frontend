import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://api.agrieldo.com/api/cooperatives';

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

const ManagerMilkRecordsScreen = ({route}) => {
  const coopId = route.params?.coopId;

  const [loading, setLoading] = useState(true);
  const [milkRecords, setMilkRecords] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Format date to YYYY-MM-DD
  const formatDate = date => date.toISOString().split('T')[0];

  const fetchMilkRecords = async date => {
    try {
      setLoading(true);
      const headers = await getAuthHeaders();

      const res = await axios.get(
        `${BASE_URL}/milk/records/${coopId}/?date=${formatDate(date)}`,
        headers,
      );

      setMilkRecords(res.data);
    } catch (error) {
      console.log('Fetch milk records error:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilkRecords(selectedDate);
  }, []);

  const onChangeDate = (event, date) => {
    if (date) {
      setSelectedDate(date);
      fetchMilkRecords(date);
    }
    setShowPicker(false);
  };

  const renderItem = ({item}) => (
    <View style={styles.recordCard}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Ionicons name="person-outline" size={30} color="#ffa500" />
        <View style={{marginLeft: 10}}>
          <Text style={styles.farmerName}>{item.farmer_name}</Text>
          <Text style={styles.session}>
            {item.session} — {item.quantity_liters} L
          </Text>
        </View>
      </View>
      <Text style={styles.timestamp}>{item.date}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
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

      {/* LOADING */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ffa500"
          style={{marginTop: 40}}
        />
      ) : milkRecords.length === 0 ? (
        <Text style={styles.noData}>No milk records for this date.</Text>
      ) : (
        <FlatList
          data={milkRecords}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{paddingBottom: 20}}
        />
      )}
    </View>
  );
};

export default ManagerMilkRecordsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f6f6f6',
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
    marginLeft: 10,
    fontSize: 16,
  },
  recordCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 12,
    borderRadius: 10,
    elevation: 2,
  },
  farmerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  session: {
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    marginTop: 6,
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  noData: {
    textAlign: 'center',
    color: '#666',
    marginTop: 30,
    fontSize: 16,
  },
});
