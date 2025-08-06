import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Button,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native';
import {fetchDailyTotals, fetchDailyFeedVsMilkRevenue} from '../utils/api';
import MilkProductionChart from '../components/MilkProductionChart';
import styles from '../assets/styles/DairyDashboard';
import {useNavigation} from '@react-navigation/native';

import FeedVsMilkRevenueChart from '../components/FeedVsMilkRevenueChart';

const DairyDashboard = ({farmId}) => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    milkToday: 0,
    averageYield: 0,
    lactatingAnimals: 0,
    milkRevenueThisMonth: 0,
    feedCostThisMonth: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const today = new Date();
        const startDate = new Date(today.setDate(today.getDate() - 60))
          .toISOString()
          .split('T')[0];
        const endDate = new Date().toISOString().split('T')[0];

        const dailyTotals = await fetchDailyTotals(startDate, endDate);
        const revenueStartDate = new Date(today.setDate(today.getDate() - 30))
          .toISOString()
          .split('T')[0];
        const revenueData = await fetchDailyFeedVsMilkRevenue(
          farmId,
          revenueStartDate,
          endDate,
        );

        const todayStr = new Date().toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
        });
        const todayData = dailyTotals.find(
          entry => entry.date === todayStr,
        ) || {
          total_milk_yield: 0,
        };
        const milkToday = todayData.total_milk_yield;

        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthMap = {
          Jan: 0,
          Feb: 1,
          Mar: 2,
          Apr: 3,
          May: 4,
          Jun: 5,
          Jul: 6,
          Aug: 7,
          Sep: 8,
          Oct: 9,
          Nov: 10,
          Dec: 11,
        };
        const currentMonthData = dailyTotals.filter(entry => {
          const [monthStr] = entry.date.split(' ');
          const entryMonth = monthMap[monthStr];
          return entryMonth === currentMonth;
        });
        const totalMilkThisMonth = currentMonthData.reduce(
          (sum, entry) => sum + entry.total_milk_yield,
          0,
        );

        const lactatingAnimals = 28; // Placeholder
        const averageYield =
          lactatingAnimals > 0
            ? (
                totalMilkThisMonth /
                lactatingAnimals /
                currentMonthData.length
              ).toFixed(1)
            : 0;

        const milkRevenueThisMonth = revenueData.reduce(
          (sum, entry) => sum + entry.milk_revenue,
          0,
        );
        const feedCostThisMonth = revenueData.reduce(
          (sum, entry) => sum + entry.feed_cost,
          0,
        );

        setDashboardData({
          milkToday,
          averageYield,
          lactatingAnimals,
          milkRevenueThisMonth,
          feedCostThisMonth,
        });
        setLoading(false);
      } catch (error) {
        console.error('DairyDashboard: Failed to load data:', error);
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [farmId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>Dairy Dashboard</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ViewAnimals', {farmId})}
          style={styles.smallButton}>
          <Text style={styles.smallButtonText}>View Animals</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>🥛 Today's Milk</Text>
        <Text style={styles.value}>{dashboardData.milkToday.toFixed(1)} L</Text>
        <Text style={styles.subText}>
          Avg Yield/Cow: {dashboardData.averageYield} L
        </Text>
        <Text style={styles.subText}>
          Lactating Cows: {dashboardData.lactatingAnimals}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>💰 Financials</Text>
        <Text style={styles.subText}>
          Milk Revenue: Ksh. {dashboardData.milkRevenueThisMonth.toFixed(2)}
        </Text>
        <Text style={styles.subText}>
          Feed Cost: Ksh. {dashboardData.feedCostThisMonth.toFixed(2)}
        </Text>
        <Text style={styles.subText}>
          Profit: Ksh.{' '}
          {(
            dashboardData.milkRevenueThisMonth - dashboardData.feedCostThisMonth
          ).toFixed(2)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>📈 Milk Production Trend</Text>
        <View style={styles.chartWrapper}>
          <MilkProductionChart farmId={farmId} />
        </View>
      </View>
      <View style={styles.feedVsMilkCard}>
        <View style={styles.chartFeedWrapper}>
          <FeedVsMilkRevenueChart farmId={farmId} />
        </View>
      </View>
    </ScrollView>
  );
};

export default DairyDashboard;
