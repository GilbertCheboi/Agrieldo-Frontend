import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';

const MilkDetailScreen = ({ route }) => {
  const { date, productionDetails } = route.params;

  // Calculate total production per cow and total for the day
  let totalMorning = 0;
  let totalEvening = 0;
  const cowTotals = productionDetails.map(item => {
    const total = item.morning + item.evening;
    totalMorning += item.morning;
    totalEvening += item.evening;
    return { cowId: item.cowId, morning: item.morning, evening: item.evening, total };
  });

  const totalForDay = totalMorning + totalEvening;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Milk Production Details for {date}</Text>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Morning: <Text style={styles.totalValue}>{totalMorning} litres</Text></Text>
        <Text style={styles.totalText}>Total Evening: <Text style={styles.totalValue}>{totalEvening} litres</Text></Text>
        <Text style={styles.totalText}>Total for the Day: <Text style={styles.totalValue}>{totalForDay} litres</Text></Text>
      </View>
      <FlatList
        data={cowTotals}
        keyExtractor={(item) => item.cowId}
        renderItem={({ item }) => (
          <View style={styles.recordItem}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: 'https://via.placeholder.com/50' }} // Placeholder image for each cow
                style={styles.cowImage}
              />
              <Text style={styles.cowId}>{item.cowId}</Text>
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.recordText}>Morning: <Text style={styles.recordValue}>{item.morning} litres</Text></Text>
              <Text style={styles.recordText}>Evening: <Text style={styles.recordValue}>{item.evening} litres</Text></Text>
              <Text style={styles.recordText}>Total: <Text style={styles.recordValue}>{item.total} litres</Text></Text>
            </View>
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
    backgroundColor: '#eef2f3',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  totalContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    elevation: 5,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  totalText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#34495e',
  },
  totalValue: {
    fontWeight: '700',
    color: '#e67e22',
  },
  recordItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  cowImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  cowId: {
    fontWeight: '600',
    color: '#2980b9',
  },
  detailsContainer: {
    flex: 1,
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

export default MilkDetailScreen;
