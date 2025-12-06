import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  fetchDailyTotals,
  fetchDailyFeedVsMilkRevenue,
  fetchLactatingAnimals,
} from '../utils/api';

import MilkProductionChart from '../components/MilkProductionChart';
import FeedVsMilkRevenueChart from '../components/FeedVsMilkRevenueChart';
import styles from '../assets/styles/DairyDashboard';
import {useNavigation} from '@react-navigation/native';

const safeFixed = (val, digits = 1) => {
  const num = Number(val);
  return isFinite(num) ? num.toFixed(digits) : '0.0';
};

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

  const [dailyTotals, setDailyTotals] = useState([]);
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    if (!farmId) {
      console.warn('⚠️ DairyDashboard mounted without farmId, skipping fetch');
      return;
    }

    const loadDashboardData = async () => {
      try {
        const today = new Date();
        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - 60);

        const startStr = startDate.toISOString().split('T')[0];
        const endStr = today.toISOString().split('T')[0];

        const fetchedDailyTotals = await fetchDailyTotals(startStr, endStr);

        const revenueStartDate = new Date();
        revenueStartDate.setDate(revenueStartDate.getDate() - 30);

        const fetchedRevenueData = await fetchDailyFeedVsMilkRevenue(
          farmId,
          revenueStartDate.toISOString().split('T')[0],
          endStr,
        );

        const lactatingList = await fetchLactatingAnimals();
        const lactatingCount = Array.isArray(lactatingList)
          ? lactatingList.length
          : 0;

        const safeDaily = Array.isArray(fetchedDailyTotals)
          ? fetchedDailyTotals
          : [];

        const normalizeDate = raw => {
          if (!raw) return '';
          if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
          const parsed = new Date(raw + ' ' + new Date().getFullYear());
          return !isNaN(parsed) ? parsed.toISOString().split('T')[0] : raw;
        };

        const sanitizedDaily = safeDaily.map(entry => ({
          date: normalizeDate(entry?.date),
          total_milk_yield: Number(entry?.total_milk_yield) || 0,
          total_feed_consumption: Number(entry?.total_feed_consumption) || 0,
          total_scc: Number(entry?.total_scc) || 0,
        }));

        const safeRevenue = Array.isArray(fetchedRevenueData)
          ? fetchedRevenueData
          : [];

        const sanitizedRevenue = safeRevenue.map(entry => ({
          date: normalizeDate(entry?.date),
          milk_revenue:
            Number(entry?.milk_revenue) || Number(entry?.milk_yield) || 0,
          feed_cost:
            Number(entry?.feed_cost) || Number(entry?.feed_consumption) || 0,
        }));

        setDailyTotals(sanitizedDaily);
        setRevenueData(sanitizedRevenue);

        const todayStr = today.toISOString().split('T')[0];
        const milkToday =
          sanitizedDaily.find(d => d.date === todayStr)?.total_milk_yield || 0;

        const avgMilk =
          sanitizedDaily.length > 0
            ? sanitizedDaily.reduce((sum, d) => sum + d.total_milk_yield, 0) /
              sanitizedDaily.length
            : 0;

        setDashboardData(prev => ({
          ...prev,
          milkToday,
          averageYield: avgMilk,
          lactatingAnimals: lactatingCount,
          milkRevenueThisMonth: sanitizedRevenue.reduce(
            (sum, e) => sum + (e.milk_revenue || 0),
            0,
          ),
          feedCostThisMonth: sanitizedRevenue.reduce(
            (sum, e) => sum + (e.feed_cost || 0),
            0,
          ),
        }));
      } catch (error) {
        console.error('DairyDashboard: Failed to load data:', error);
      } finally {
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

  const hasMilkData = dailyTotals.some(d => Number(d.total_milk_yield) > 0);
  const hasRevenueData = revenueData.some(
    d => Number(d.milk_revenue) > 0 || Number(d.feed_cost) > 0,
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{paddingBottom: 40}}>
      <View style={styles.titleSection}>
        <Text style={styles.sectionTitle}>Dairy Dashboard</Text>

        {/* Keep ONLY View Animals button at top */}
        <View style={styles.buttonStack}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ViewAnimals', {farmId})}
            style={styles.smallButton}>
            <Text style={styles.smallButtonText}>View Animals</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <Text style={styles.value}>{safeFixed(dashboardData.milkToday)} L</Text>

      <Text style={styles.subText}>
        Avg Yield/Day: {safeFixed(dashboardData.averageYield)} L
      </Text>

      <Text style={styles.subText}>
        Lactating Cows: {dashboardData.lactatingAnimals}
      </Text>

      <Text style={styles.subText}>
        Milk Revenue: Ksh. {safeFixed(dashboardData.milkRevenueThisMonth, 2)}
      </Text>

      <Text style={styles.subText}>
        Feed Cost: Ksh. {safeFixed(dashboardData.feedCostThisMonth, 2)}
      </Text>

      <Text style={styles.subText}>
        Profit: Ksh.{' '}
        {safeFixed(
          Number(dashboardData.milkRevenueThisMonth) -
            Number(dashboardData.feedCostThisMonth),
          2,
        )}
      </Text>

      {/* 
        ------------------------------------------------------
        ✅ PRODUCTION HISTORY BUTTON MOVED HERE
        ------------------------------------------------------
      */}
      <View style={styles.buttonStack}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProductionHistoryScreen', {
              farmId,
            })
          }
          style={styles.smallButton}>
          <Text style={styles.smallButtonText}>Production History</Text>
        </TouchableOpacity>
      </View>

      {/* Milk Chart */}
      <View style={styles.card}>
        <Text style={styles.title}>📈 Milk Production Trend</Text>
        <View style={styles.chartWrapper}>
          {hasMilkData ? (
            <MilkProductionChart data={dailyTotals} />
          ) : (
            <Text style={{textAlign: 'center', color: '#888'}}>
              No milk production data available yet
            </Text>
          )}
        </View>
      </View>

      {/* Revenue Chart */}
      <View style={styles.feedVsMilkCard}>
        <View style={styles.chartFeedWrapper}>
          {hasRevenueData ? (
            <FeedVsMilkRevenueChart data={revenueData} />
          ) : (
            <Text style={{textAlign: 'center', color: '#888'}}>
              No revenue/feed data available yet
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default DairyDashboard;
