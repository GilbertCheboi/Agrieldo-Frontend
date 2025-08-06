// File: FeedVsMilkYieldChart.js

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import {BarChart} from 'react-native-chart-kit';
import {fetchDailyFeedVsMilkRevenue} from '../utils/api';

const screenWidth = Dimensions.get('window').width;

const FeedVsMilkYieldChart = ({farmId}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 10 * 86400000)
          .toISOString()
          .split('T')[0];

        const raw = await fetchDailyFeedVsMilkRevenue(
          farmId,
          startDate,
          endDate,
        );

        // Map exactly what you have
        setData(
          raw.map(item => ({
            date: item.date,
            feed: Number(item.feed_consumption || 0),
            milk: Number(item.milk_yield || 0),
          })),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    })();
  }, [farmId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#ffa500" />;
  }
  if (!data.length) {
    return <Text style={styles.noData}>No chart data available.</Text>;
  }

  const labels = data.map(d => d.date); // ['Jul 02', 'Jul 03']
  const feedData = data.map(d => d.feed); // [300, 400]
  const milkData = data.map(d => d.milk); // [15, 20]

  // Each cluster gets 2 bars, so we give 80px per cluster
  const clusterWidth = 80;
  const chartWidth = labels.length * clusterWidth;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>Feed vs Milk Yield</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          data={{
            labels,
            datasets: [
              {data: feedData, color: () => '#4caf50'},
              {data: milkData, color: () => '#ffa500'},
            ],
            legend: ['Feed (kg)', 'Milk (L)'],
          }}
          width={chartWidth}
          height={280}
          fromZero
          showValuesOnTopOfBars
          withInnerLines={false}
          barPercentage={0.6} // controls bar thickness
          barRadius={6} // rounded corners
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: () => '#333',
            labelColor: () => '#333',
            propsForLabels: {fontSize: 10},
            propsForBackgroundLines: {strokeWidth: 1, stroke: '#e3e3e3'},
          }}
          style={styles.chart}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 10,
    marginTop: 10,
    marginBottom: 20, // <-- Added this line
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#1a3c34',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    color: 'gray',
  },
  chart: {
    borderRadius: 8,
    marginTop: 20,
  },
});

export default FeedVsMilkYieldChart;
