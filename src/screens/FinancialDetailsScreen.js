import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const FinancialDetailsScreen = ({ route }) => {
  const { month } = route.params;

  // Sample data for monthly expenses (add real data as needed)
  const monthlyExpenses = {
    January: [
      { item: 'Feed', cost: 2000 },
      { item: 'Vet Services', cost: 500 },
      { item: 'Equipment', cost: 300 },
    ],
    February: [
      { item: 'Feed', cost: 1800 },
      { item: 'Vet Services', cost: 400 },
      { item: 'Miscellaneous', cost: 300 },
    ],
    // Add more months...
  };

  const expenses = monthlyExpenses[month] || [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expenses for {month}</Text>
      <FlatList
        data={expenses}
        keyExtractor={(item) => item.item}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <Text style={styles.recordText}>Item: {item.item}</Text>
            <Text style={styles.recordText}>Cost: ${item.cost}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  recordItem: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    elevation: 2,
  },
  recordText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default FinancialDetailsScreen;
