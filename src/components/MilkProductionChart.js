import React from 'react';
import {View, Text, Dimensions, ScrollView} from 'react-native';
import {LineChart} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const formatDate = dateStr => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return isNaN(d)
    ? dateStr
    : d.toLocaleDateString('en-US', {month: 'short', day: 'numeric'});
};

const MilkProductionChart = ({data}) => {
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Text style={{color: '#999', textAlign: 'center', marginTop: 10}}>
        No milk production data available yet.
      </Text>
    );
  }

  const labels = data.map(e => formatDate(e.date));
  const values = data.map(e => Number(e.total_milk_yield || 0));

  const chartData = {
    labels,
    datasets: [{data: values}],
  };

  // Scrollable internal width
  const scrollWidth = Math.max(labels.length * 45, screenWidth);

  return (
    <View>
      <Text
        style={{
          fontWeight: 'bold',
          fontSize: 16,
          color: '#1a3c34',
          marginBottom: 8,
          textAlign: 'center',
        }}>
        Milk Yield Over Time
      </Text>

      {/* ⭐ FIX: Outer wrapper controls size & prevents breaking */}
      <View style={{width: screenWidth - 32, overflow: 'hidden'}}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          nestedScrollEnabled={true}>
          <LineChart
            data={chartData}
            width={scrollWidth}
            height={240}
            fromZero
            yAxisSuffix="L"
            chartConfig={{
              backgroundGradientFrom: '#ffffff',
              backgroundGradientTo: '#ffffff',
              decimalPlaces: 0,
              color: opacity => `rgba(255, 165, 0, ${opacity})`,
              labelColor: opacity => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: '#ffa500',
              },
            }}
            bezier
            style={{borderRadius: 10}}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default MilkProductionChart;
