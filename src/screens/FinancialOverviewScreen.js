import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

const FinancialOverviewScreen = ({ navigation }) => {
  // Sample data for financial overview (dummy data)
  const financialData = [
    { month: 'January', income: 5000, expenses: 2000 },
    { month: 'February', income: 6000, expenses: 2500 },
    { month: 'March', income: 7000, expenses: 3000 },
    { month: 'April', income: 6500, expenses: 2700 },
    { month: 'May', income: 7500, expenses: 3200 },
    // Add more months as needed
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Financial Overview</Text>
      <FlatList
        data={financialData}
        keyExtractor={(item) => item.month}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.recordItem}
            onPress={() => navigation.navigate('FinancialDetails', { month: item.month })}
          >
            <Text style={styles.recordText}>Month: {item.month}</Text>
            <Text style={styles.recordText}>
              Income: <Text style={styles.recordValue}>${item.income}</Text>
            </Text>
            <Text style={styles.recordText}>
              Expenses: <Text style={styles.recordValue}>${item.expenses}</Text>
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#eef2f3',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  recordItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  recordText: {
    fontSize: 16,
    color: '#34495e',
    marginBottom: 5,
  },
  recordValue: {
    fontWeight: '500',
    color: '#27ae60',
  },
});

export default FinancialOverviewScreen;
