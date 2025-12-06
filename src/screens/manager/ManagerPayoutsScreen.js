import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const BASE_URL = 'http://api.agrieldo.com/api/cooperatives';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const ManagerPayoutsScreen = ({route}) => {
  const coopId = route.params?.coopId;

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const [loading, setLoading] = useState(true);
  const [farmers, setFarmers] = useState([]);

  const [rate, setRate] = useState('45'); // default per liter rate
  const [refreshing, setRefreshing] = useState(false);

  // Load payout data
  const loadPayouts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/payouts/${coopId}/?month=${selectedMonth}&year=${year}`,
      );
      setFarmers(res.data);
    } catch (error) {
      console.log('Payout error:', error.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, [selectedMonth, year]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPayouts();
    setRefreshing(false);
  };

  const calculateNet = (liters, deductions) => {
    const gross = liters * parseFloat(rate || 0);
    const totalDeductions = deductions?.total || 0;
    return gross - totalDeductions;
  };

  const renderFarmer = ({item}) => {
    const net = calculateNet(item.total_liters, item.deductions);

    return (
      <View style={styles.card}>
        <Text style={styles.farmerName}>{item.name}</Text>
        <Text style={styles.label}>Milk: {item.total_liters} L</Text>
        <Text style={styles.label}>Gross: KES {item.total_liters * rate}</Text>

        <Text style={styles.label}>Deductions:</Text>
        <Text style={styles.deduction}>• Feed: KES {item.deductions.feed}</Text>
        <Text style={styles.deduction}>
          • Drugs: KES {item.deductions.drugs}
        </Text>
        <Text style={styles.deduction}>
          • Loans: KES {item.deductions.loans}
        </Text>

        <Text style={styles.netPayout}>Net: KES {net.toFixed(2)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Payouts</Text>

      {/* Month Selector */}
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => setSelectedMonth(prev => (prev > 1 ? prev - 1 : 12))}>
          <Ionicons name="chevron-back" size={28} color="#ffa500" />
        </TouchableOpacity>

        <Text style={styles.monthText}>
          {months[selectedMonth - 1]} {year}
        </Text>

        <TouchableOpacity
          onPress={() => setSelectedMonth(prev => (prev < 12 ? prev + 1 : 1))}>
          <Ionicons name="chevron-forward" size={28} color="#ffa500" />
        </TouchableOpacity>
      </View>

      {/* Rate per liter */}
      <View style={styles.rateRow}>
        <Text style={styles.label}>Rate per liter (KES):</Text>
        <TextInput
          value={rate}
          onChangeText={setRate}
          keyboardType="numeric"
          style={styles.rateInput}
        />
      </View>

      {/* Data */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ffa500"
          style={{marginTop: 40}}
        />
      ) : farmers.length === 0 ? (
        <Text style={styles.noData}>No payout data for this month.</Text>
      ) : (
        <FlatList
          data={farmers}
          keyExtractor={item => item.id.toString()}
          renderItem={renderFarmer}
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      )}
    </View>
  );
};

export default ManagerPayoutsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 15, backgroundColor: '#f6f6f6'},
  header: {fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  monthText: {fontSize: 18, fontWeight: 'bold', color: '#333'},
  rateRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 15},
  rateInput: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginLeft: 15,
    fontSize: 16,
    width: 80,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3,
  },
  farmerName: {fontSize: 17, fontWeight: 'bold', color: '#333'},
  label: {fontSize: 14, color: '#666'},
  deduction: {fontSize: 13, color: '#aa0000', marginLeft: 10},
  netPayout: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffa500',
  },
  noData: {textAlign: 'center', marginTop: 30, fontSize: 16},
});
