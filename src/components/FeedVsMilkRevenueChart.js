import React from 'react';
import {View, Text, StyleSheet, Dimensions, ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

// Small helper to format date to "Jan 05"
const formatDate = dateStr => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date)) return dateStr; // fallback if invalid

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
  });
};

const FeedVsMilkRevenueChart = ({data}) => {
  if (!data || data.length === 0) {
    return (
      <Text style={{textAlign: 'center', color: '#888'}}>
        No feed vs milk data available yet
      </Text>
    );
  }

  // Format labels to "Jan 05"
  const labels = data.map(entry => formatDate(entry.date));

  const feedData = data.map(entry => Number(entry.feed_cost || 0));
  const milkData = data.map(entry => Number(entry.milk_revenue || 0));

  const chartData = {
    labels,
    datasets: [
      {
        data: feedData,
        color: opacity => `rgba(255, 99, 132, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: milkData,
        color: opacity => `rgba(54, 162, 235, ${opacity})`,
        strokeWidth: 2,
      },
    ],
    legend: ['Feed Cost', 'Milk Revenue'],
  };

  // Wider width for scrolling
  const scrollChartWidth = Math.max(labels.length * 50, screenWidth);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>📊 Feed Cost vs Milk Revenue</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={chartData}
          width={scrollChartWidth}
          height={260}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </ScrollView>
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 1,
  color: opacity => `rgba(255, 165, 0, ${opacity})`,
  labelColor: opacity => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: '3',
    strokeWidth: '2',
    stroke: '#ffa500',
  },
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
  },
  chart: {
    marginVertical: 10,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
});

export default FeedVsMilkRevenueChart;
