import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';

const {width} = Dimensions.get('window');

const FinancialOverview = ({
  financialChartData = [],
  totalCost = 0,
  darkMode,
}) => {
  // 🎨 Consistent color scheme by category
  const colorMap = {
    Feed: '#FF8042', // orange
    Health: '#FFBB28', // yellow
    Reproduction: '#A569BD', // purple
    Lactation: '#00C49F', // green
    'Milk Revenue': '#0088FE', // ✅ blue for milk
  };

  const COLORS = [
    '#FF8042',
    '#FFBB28',
    '#00C49F',
    '#0088FE',
    '#A569BD',
    '#FF66C4',
    '#4CAF50',
  ];

  const total = totalCost > 0 ? totalCost : 1;

  const pieData = financialChartData.map((item, index) => ({
    value: Number(item?.value) || 0,
    color: colorMap[item?.name] || COLORS[index % COLORS.length],
    text: `${(((Number(item?.value) || 0) / total) * 100).toFixed(1)}%`,
    label: item?.name || 'Unknown',
  }));

  const allZero = pieData.every(item => item.value === 0);

  return (
    <ScrollView
      style={[
        styles.scrollContainer,
        {backgroundColor: darkMode ? '#121212' : '#fafafa'},
      ]}
      contentContainerStyle={{paddingBottom: 10}}>
      <View
        style={[
          styles.container,
          {backgroundColor: darkMode ? '#1e1e1e' : '#fff'},
        ]}>
        <Text style={[styles.title, {color: darkMode ? '#fff' : '#000'}]}>
          Financial Overview
        </Text>

        <Text style={[styles.total, {color: darkMode ? '#ccc' : '#333'}]}>
          <Text style={styles.bold}>Total Cost: </Text>Ksh.
          {totalCost.toFixed(2)}
        </Text>

        {/* Pie Chart */}
        <View style={styles.chartWrapper}>
          {!allZero ? (
            <PieChart
              data={pieData}
              donut
              radius={width * 0.21} // ⚖️ slightly increased from 0.19
              innerRadius={width * 0.12} // ⚖️ increased from 0.10 → thicker ring
              centerLabelComponent={() => (
                <View style={{alignItems: 'center'}}>
                  <Text
                    style={{
                      fontSize: 13,
                      color: darkMode ? '#fff' : '#000',
                      fontWeight: '600',
                    }}>
                    Total
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: darkMode ? '#FFBB28' : '#FF8042',
                    }}>
                    Ksh.{totalCost.toFixed(0)}
                  </Text>
                </View>
              )}
            />
          ) : (
            <Text
              style={{
                color: darkMode ? '#ccc' : '#333',
                fontSize: 13,
                marginTop: 10,
              }}>
              No financial data available.
            </Text>
          )}
        </View>

        {/* Legend */}
        <View style={styles.legendContainer}>
          {financialChartData.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View
                style={[
                  styles.legendColor,
                  {
                    backgroundColor:
                      colorMap[item.name] || COLORS[index % COLORS.length],
                  },
                ]}
              />
              <Text
                style={[
                  styles.legendText,
                  {color: darkMode ? '#ccc' : '#333'},
                ]}>
                {item.name}: Ksh.{(Number(item.value) || 0).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  container: {
    borderRadius: 12,
    padding: 12, // slightly increased for visual balance
    marginHorizontal: 10,
    marginVertical: 8,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 1},
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  total: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 6,
  },
  bold: {
    fontWeight: 'bold',
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  legendContainer: {
    marginTop: 6,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendColor: {
    width: 13,
    height: 13,
    borderRadius: 3,
    marginRight: 6,
  },
  legendText: {
    fontSize: 11.5,
  },
});

export default FinancialOverview;
