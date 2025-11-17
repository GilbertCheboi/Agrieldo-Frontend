import React, {useMemo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {LineChart} from 'react-native-gifted-charts';

const {width} = Dimensions.get('window');

// Normalize date (for sorting and labeling)
const normalizeDate = dateStr => {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  const d = new Date(`${dateStr} ${new Date().getFullYear()}`);
  return isNaN(d) ? dateStr : d.toISOString().split('T')[0];
};

const DailyMilkProduction = ({
  records = [],
  setIsMilkModalOpen,
  setIsEditingMilk,
  setMilkForm,
  handleEditMilk,
  canEdit = false,
  darkMode = false,
}) => {
  // Prepare chart data: sum milk_yield per date
  const chartData = useMemo(() => {
    const grouped = records.reduce((acc, record) => {
      const date = normalizeDate(record.date);
      if (!acc[date]) acc[date] = 0;
      acc[date] += Number(record.milk_yield) || 0;
      return acc;
    }, {});

    return Object.entries(grouped)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([date, value]) => ({
        value,
        label: date.split('-').slice(1).join('-'), // "MM-DD"
      }));
  }, [records]);

  const handleAdd = () => {
    const today = new Date().toISOString().split('T')[0];
    setIsEditingMilk(false);
    setMilkForm({
      date: today,
      session: '',
      milk_yield: '',
      milk_price_per_liter: '',
      feed_consumption: '',
      scc: '',
      fat_percentage: '',
      protein_percentage: '',
    });
    setIsMilkModalOpen(true);
  };

  return (
    <View
      style={[styles.card, {backgroundColor: darkMode ? '#1e1e1e' : '#fff'}]}>
      <Text style={[styles.title, {color: darkMode ? '#fff' : '#1a3c34'}]}>
        Daily Milk Production
      </Text>

      {chartData.length === 0 ? (
        <Text style={styles.noData}>No production data available.</Text>
      ) : (
        <View style={styles.chartWrapper}>
          <LineChart
            areaChart
            data={chartData}
            curved
            hideDataPoints={false}
            color1="#ffa500"
            startFillColor="#ffa500"
            endFillColor={darkMode ? '#1e1e1e' : '#fff'}
            startOpacity={0.6}
            endOpacity={0.1}
            yAxisColor={darkMode ? '#fff' : '#000'}
            xAxisColor={darkMode ? '#fff' : '#000'}
            yAxisTextStyle={{
              color: darkMode ? '#ccc' : '#555',
              fontSize: 10,
            }}
            xAxisLabelTextStyle={{
              color: darkMode ? '#ccc' : '#555',
              fontSize: 9,
              rotation: 30,
            }}
            thickness={2}
            height={220}
            width={width - 40}
            hideRules={false}
            hideAxesAndRules={false}
            yAxisLabelWidth={30}
            yAxisOffset={0}
          />
        </View>
      )}

      {canEdit && (
        <TouchableOpacity onPress={handleAdd} style={styles.fab}>
          <Icon name="plus" size={22} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    borderRadius: 10,
    padding: 12,
    elevation: 3,
    position: 'relative',
    marginBottom: 60,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  chartWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  fab: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ffa500',
    borderRadius: 20,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  noData: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginTop: 20,
  },
});

export default DailyMilkProduction;
