import React from 'react';
import {View, Text, StyleSheet, ScrollView, Dimensions} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';

const {width} = Dimensions.get('window');

const FinancialOverview = ({financialChartData = [], darkMode}) => {
  // 🎯 Cost Categories only
  const costCategories = ['Feed', 'Health', 'Reproduction', 'Lactation'];

  // 🎨 Color scheme
  const colorMap = {
    Feed: '#FF8042',
    Health: '#FFBB28',
    Reproduction: '#A569BD',
    Lactation: '#00C49F',
    'Milk Revenue': '#0088FE',
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

  // 🔹 Compute Total Cost
  const totalCost = financialChartData
    .filter(item => costCategories.includes(item.name))
    .reduce((sum, item) => sum + Number(item.value || 0), 0);

  // 🔹 Milk Revenue
  const milkRevenue = Number(
    financialChartData.find(i => i.name === 'Milk Revenue')?.value || 0,
  );

  // 🔹 Profit (Revenue - Cost)
  const profit = milkRevenue - totalCost;

  // 🔹 Pie chart keeps ALL items
  const totalAll = financialChartData.reduce(
    (s, d) => s + Number(d.value || 0),
    0,
  );

  const pieData = financialChartData.map((item, index) => ({
    value: Number(item?.value) || 0,
    color: colorMap[item?.name] || COLORS[index % COLORS.length],
    text: `${(((Number(item?.value) || 0) / (totalAll || 1)) * 100).toFixed(
      1,
    )}%`,
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

        {/* Total Cost */}
        <Text style={[styles.metricText, {color: darkMode ? '#ccc' : '#333'}]}>
          <Text style={styles.bold}>Total Cost: </Text>Ksh.
          {totalCost.toFixed(2)}
        </Text>

        {/* 📌 PROFIT CARD */}
        <View
          style={[
            styles.profitBox,
            {
              backgroundColor:
                profit > 0
                  ? 'rgba(76,175,80,0.15)' // green tint
                  : profit < 0
                  ? 'rgba(255,99,71,0.15)' // red tint
                  : 'rgba(180,180,180,0.15)', // grey tint
              borderColor:
                profit > 0 ? '#4CAF50' : profit < 0 ? '#FF3B30' : '#999',
            },
          ]}>
          <Text
            style={[
              styles.profitLabel,
              {
                color:
                  profit > 0
                    ? '#4CAF50'
                    : profit < 0
                    ? '#FF3B30'
                    : darkMode
                    ? '#ccc'
                    : '#666',
              },
            ]}>
            Profit
          </Text>

          <Text
            style={[
              styles.profitValue,
              {
                color:
                  profit > 0
                    ? '#4CAF50'
                    : profit < 0
                    ? '#FF3B30'
                    : darkMode
                    ? '#ccc'
                    : '#666',
              },
            ]}>
            Ksh.{profit.toFixed(2)}
          </Text>
        </View>

        {/* Pie Chart */}
        <View style={styles.chartWrapper}>
          {!allZero ? (
            <PieChart
              data={pieData}
              donut
              radius={width * 0.21}
              innerRadius={width * 0.12}
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
  scrollContainer: {flex: 1},
  container: {
    borderRadius: 12,
    padding: 12,
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
  metricText: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
  bold: {fontWeight: 'bold'},

  /* PROFIT BLOCK */
  profitBox: {
    marginTop: 6,
    marginBottom: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.2,
    alignSelf: 'center',
    minWidth: '60%',
  },
  profitLabel: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  profitValue: {
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 2,
  },

  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  legendContainer: {marginTop: 6},
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
  legendText: {fontSize: 11.5},
});

export default FinancialOverview;
