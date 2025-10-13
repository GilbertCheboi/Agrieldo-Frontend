// import React, {useEffect, useState} from 'react';
// import {
//   View,
//   Text,
//   ActivityIndicator,
//   Button,
//   TouchableOpacity,
// } from 'react-native';
// import {ScrollView} from 'react-native';
// import {fetchDailyTotals, fetchDailyFeedVsMilkRevenue} from '../utils/api';
// import MilkProductionChart from '../components/MilkProductionChart';
// import styles from '../assets/styles/DairyDashboard';
// import {useNavigation} from '@react-navigation/native';

// import FeedVsMilkRevenueChart from '../components/FeedVsMilkRevenueChart';

// const DairyDashboard = ({farmId}) => {
//   const navigation = useNavigation();

//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState({
//     milkToday: 0,
//     averageYield: 0,
//     lactatingAnimals: 0,
//     milkRevenueThisMonth: 0,
//     feedCostThisMonth: 0,
//   });
//   const [dailyTotals, setDailyTotals] = useState([]);
//   const [revenueData, setRevenueData] = useState([]);

//   useEffect(() => {
//     const loadDashboardData = async () => {
//       try {
//         const today = new Date();
//         const startDate = new Date(today);
//         startDate.setDate(startDate.getDate() - 60);
//         const startStr = startDate.toISOString().split('T')[0];
//         const endStr = new Date().toISOString().split('T')[0];

//         const fetchedDailyTotals =
//           (await fetchDailyTotals(startStr, endStr)) || [];
//         const revenueStartDate = new Date();
//         revenueStartDate.setDate(revenueStartDate.getDate() - 30);
//         const fetchedRevenueData =
//           (await fetchDailyFeedVsMilkRevenue(
//             farmId,
//             revenueStartDate.toISOString().split('T')[0],
//             endStr,
//           )) || [];

//         setDailyTotals(fetchedDailyTotals);
//         setRevenueData(fetchedRevenueData);

//         const todayStr = new Date().toLocaleDateString('en-US', {
//           day: '2-digit',
//           month: 'short',
//         });
//         const todayData = fetchedDailyTotals.find(
//           entry => entry.date === todayStr,
//         ) || {total_milk_yield: 0};
//         const milkToday = todayData.total_milk_yield || 0;

//         const currentMonth = new Date().getMonth();
//         const monthMap = {
//           Jan: 0,
//           Feb: 1,
//           Mar: 2,
//           Apr: 3,
//           May: 4,
//           Jun: 5,
//           Jul: 6,
//           Aug: 7,
//           Sep: 8,
//           Oct: 9,
//           Nov: 10,
//           Dec: 11,
//         };
//         const currentMonthData = fetchedDailyTotals.filter(entry => {
//           const [monthStr] = entry.date.split(' ');
//           return monthMap[monthStr] === currentMonth;
//         });
//         const totalMilkThisMonth = currentMonthData.reduce(
//           (sum, entry) => sum + (entry.total_milk_yield || 0),
//           0,
//         );

//         const lactatingAnimals = 28; // Placeholder
//         const averageYield =
//           lactatingAnimals > 0 && currentMonthData.length > 0
//             ? (
//                 totalMilkThisMonth /
//                 lactatingAnimals /
//                 currentMonthData.length
//               ).toFixed(1)
//             : 0;

//         const milkRevenueThisMonth = fetchedRevenueData.reduce(
//           (sum, entry) => sum + (entry.milk_revenue || 0),
//           0,
//         );
//         const feedCostThisMonth = fetchedRevenueData.reduce(
//           (sum, entry) => sum + (entry.feed_cost || 0),
//           0,
//         );

//         setDashboardData({
//           milkToday,
//           averageYield,
//           lactatingAnimals,
//           milkRevenueThisMonth,
//           feedCostThisMonth,
//         });
//       } catch (error) {
//         console.error('DairyDashboard: Failed to load data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboardData();
//   }, [farmId]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#ffa500" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={{paddingBottom: 40}}>
//       <View style={styles.titleSection}>
//         <Text style={styles.sectionTitle}>Dairy Dashboard</Text>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('ViewAnimals', {farmId})}
//           style={styles.smallButton}>
//           <Text style={styles.smallButtonText}>View Animals</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.title}>🥛 Today's Milk</Text>
//         <Text style={styles.value}>{dashboardData.milkToday.toFixed(1)} L</Text>
//         <Text style={styles.subText}>
//           Avg Yield/Cow: {dashboardData.averageYield} L
//         </Text>
//         <Text style={styles.subText}>
//           Lactating Cows: {dashboardData.lactatingAnimals}
//         </Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.title}>💰 Financials</Text>
//         <Text style={styles.subText}>
//           Milk Revenue: Ksh. {dashboardData.milkRevenueThisMonth.toFixed(2)}
//         </Text>
//         <Text style={styles.subText}>
//           Feed Cost: Ksh. {dashboardData.feedCostThisMonth.toFixed(2)}
//         </Text>
//         <Text style={styles.subText}>
//           Profit: Ksh.{' '}
//           {(
//             dashboardData.milkRevenueThisMonth - dashboardData.feedCostThisMonth
//           ).toFixed(2)}
//         </Text>
//       </View>

//       <View style={styles.card}>
//         <Text style={styles.title}>📈 Milk Production Trend</Text>
//         <View style={styles.chartWrapper}>
//           {dailyTotals.length > 0 ? (
//             <MilkProductionChart farmId={farmId} />
//           ) : (
//             <Text style={{textAlign: 'center', color: '#888'}}>
//               No milk production data available yet
//             </Text>
//           )}
//         </View>
//       </View>

//       <View style={styles.feedVsMilkCard}>
//         <View style={styles.chartFeedWrapper}>
//           {revenueData.some(
//             entry => entry.milk_revenue > 0 || entry.feed_cost > 0,
//           ) ? (
//             <FeedVsMilkRevenueChart farmId={farmId} />
//           ) : (
//             <Text style={{textAlign: 'center', color: '#888'}}>
//               No revenue/feed data available yet
//             </Text>
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default DairyDashboard;

// import React, {useEffect, useState} from 'react';
// import {View, Text, ActivityIndicator, TouchableOpacity} from 'react-native';
// import {ScrollView} from 'react-native';
// import {fetchDailyTotals, fetchDailyFeedVsMilkRevenue} from '../utils/api';
// import MilkProductionChart from '../components/MilkProductionChart';
// import styles from '../assets/styles/DairyDashboard';
// import {useNavigation} from '@react-navigation/native';
// import FeedVsMilkRevenueChart from '../components/FeedVsMilkRevenueChart';

// const DairyDashboard = ({farmId}) => {
//   const navigation = useNavigation();

//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState({
//     milkToday: 0,
//     averageYield: 0,
//     lactatingAnimals: 0,
//     milkRevenueThisMonth: 0,
//     feedCostThisMonth: 0,
//   });
//   const [dailyTotals, setDailyTotals] = useState([]);
//   const [revenueData, setRevenueData] = useState([]);

//   useEffect(() => {
//     const loadDashboardData = async () => {
//       try {
//         const today = new Date();
//         const startDate = new Date(today);
//         startDate.setDate(startDate.getDate() - 60);
//         const startStr = startDate.toISOString().split('T')[0];
//         const endStr = new Date().toISOString().split('T')[0];

//         const fetchedDailyTotals =
//           (await fetchDailyTotals(startStr, endStr)) || [];
//         const revenueStartDate = new Date();
//         revenueStartDate.setDate(revenueStartDate.getDate() - 30);
//         const fetchedRevenueData =
//           (await fetchDailyFeedVsMilkRevenue(
//             farmId,
//             revenueStartDate.toISOString().split('T')[0],
//             endStr,
//           )) || [];

//         setDailyTotals(
//           Array.isArray(fetchedDailyTotals) ? fetchedDailyTotals : [],
//         );
//         setRevenueData(
//           Array.isArray(fetchedRevenueData) ? fetchedRevenueData : [],
//         );

//         // Milk today
//         const todayStr = new Date().toLocaleDateString('en-US', {
//           day: '2-digit',
//           month: 'short',
//         });
//         const todayData =
//           fetchedDailyTotals.find(entry => entry.date === todayStr) || {};
//         const milkToday = Number(todayData.total_milk_yield) || 0;

//         // Current month totals
//         const currentMonth = new Date().getMonth();
//         const monthMap = {
//           Jan: 0,
//           Feb: 1,
//           Mar: 2,
//           Apr: 3,
//           May: 4,
//           Jun: 5,
//           Jul: 6,
//           Aug: 7,
//           Sep: 8,
//           Oct: 9,
//           Nov: 10,
//           Dec: 11,
//         };
//         const currentMonthData = fetchedDailyTotals.filter(entry => {
//           if (!entry.date) return false;
//           const [monthStr] = entry.date.split(' ');
//           return monthMap[monthStr] === currentMonth;
//         });

//         const totalMilkThisMonth = (currentMonthData || []).reduce(
//           (sum, entry) => sum + (Number(entry.total_milk_yield) || 0),
//           0,
//         );

//         const lactatingAnimals = 28; // TODO: replace placeholder with API data
//         const averageYield =
//           lactatingAnimals > 0 && currentMonthData.length > 0
//             ? (
//                 totalMilkThisMonth /
//                 lactatingAnimals /
//                 currentMonthData.length
//               ).toFixed(1)
//             : 0;

//         const milkRevenueThisMonth = (fetchedRevenueData || []).reduce(
//           (sum, entry) => sum + (Number(entry.milk_revenue) || 0),
//           0,
//         );
//         const feedCostThisMonth = (fetchedRevenueData || []).reduce(
//           (sum, entry) => sum + (Number(entry.feed_cost) || 0),
//           0,
//         );

//         setDashboardData({
//           milkToday: isFinite(milkToday) ? milkToday : 0,
//           averageYield: isFinite(averageYield) ? averageYield : 0,
//           lactatingAnimals: isFinite(lactatingAnimals) ? lactatingAnimals : 0,
//           milkRevenueThisMonth: isFinite(milkRevenueThisMonth)
//             ? milkRevenueThisMonth
//             : 0,
//           feedCostThisMonth: isFinite(feedCostThisMonth)
//             ? feedCostThisMonth
//             : 0,
//         });
//       } catch (error) {
//         console.error('DairyDashboard: Failed to load data:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadDashboardData();
//   }, [farmId]);

//   if (loading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#ffa500" />
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={{paddingBottom: 40}}>
//       <View style={styles.titleSection}>
//         <Text style={styles.sectionTitle}>Dairy Dashboard</Text>
//         <TouchableOpacity
//           onPress={() => navigation.navigate('ViewAnimals', {farmId})}
//           style={styles.smallButton}>
//           <Text style={styles.smallButtonText}>View Animals</Text>
//         </TouchableOpacity>
//       </View>
//       {/* Milk Stats */}
//       <View style={styles.card}>
//         <Text style={styles.title}>🥛 Today's Milk</Text>
//         <Text style={styles.value}>
//           {Number(dashboardData.milkToday).toFixed(1)} L
//         </Text>
//         <Text style={styles.subText}>
//           Avg Yield/Cow: {Number(dashboardData.averageYield).toFixed(1)} L
//         </Text>
//         <Text style={styles.subText}>
//           Lactating Cows: {dashboardData.lactatingAnimals || 0}
//         </Text>
//       </View>
//       {/* Financials */}
//       <View style={styles.card}>
//         <Text style={styles.title}>💰 Financials</Text>
//         <Text style={styles.subText}>
//           Milk Revenue: Ksh.{' '}
//           {Number(dashboardData.milkRevenueThisMonth).toFixed(2)}
//         </Text>
//         <Text style={styles.subText}>
//           Feed Cost: Ksh. {Number(dashboardData.feedCostThisMonth).toFixed(2)}
//         </Text>
//         <Text style={styles.subText}>
//           Profit: Ksh.{' '}
//           {(
//             Number(dashboardData.milkRevenueThisMonth) -
//             Number(dashboardData.feedCostThisMonth)
//           ).toFixed(2)}
//         </Text>
//       </View>
//       {/* Milk Production Trend */}
//       <View style={styles.card}>
//         <Text style={styles.title}>📈 Milk Production Trend</Text>
//         <View style={styles.chartWrapper}>
//           {dailyTotals.length > 0 ? (
//             <MilkProductionChart farmId={farmId} />
//           ) : (
//             <Text style={{textAlign: 'center', color: '#888'}}>
//               No milk production data available yet
//             </Text>
//           )}
//         </View>
//       </View>
//       Revenue vs Feed Cost
//       <View style={styles.feedVsMilkCard}>
//         <View style={styles.chartFeedWrapper}>
//           {revenueData.some(
//             entry =>
//               (Number(entry.milk_revenue) || 0) > 0 ||
//               (Number(entry.feed_cost) || 0) > 0,
//           ) ? (
//             <FeedVsMilkRevenueChart farmId={farmId} />
//           ) : (
//             <Text style={{textAlign: 'center', color: '#888'}}>
//               No revenue/feed data available yet
//             </Text>
//           )}
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default DairyDashboard;

// File: src/screens/DairyDashboard.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {fetchDailyTotals, fetchDailyFeedVsMilkRevenue} from '../utils/api';
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

        // 1️⃣ Fetch Daily Totals (no farmId required)
        const fetchedDailyTotals =
          (await fetchDailyTotals(startStr, endStr)) || [];

        // 2️⃣ Fetch Revenue Data (farm-specific, last 30 days)
        const revenueStartDate = new Date();
        revenueStartDate.setDate(revenueStartDate.getDate() - 30);
        const fetchedRevenueData =
          (await fetchDailyFeedVsMilkRevenue(
            farmId,
            revenueStartDate.toISOString().split('T')[0],
            endStr,
          )) || [];

        // 3️⃣ Safety checks
        const safeDaily = Array.isArray(fetchedDailyTotals)
          ? fetchedDailyTotals
          : [];
        const safeRevenue = Array.isArray(fetchedRevenueData)
          ? fetchedRevenueData
          : [];

        // 4️⃣ Utility: normalize date → YYYY-MM-DD
        const normalizeDate = raw => {
          if (!raw) return '';
          if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
          const parsed = new Date(raw + ' ' + new Date().getFullYear());
          if (!isNaN(parsed)) {
            return parsed.toISOString().split('T')[0];
          }
          return raw;
        };

        const sanitizedDaily = safeDaily.map(entry => {
          const milk = Number(entry?.total_milk_yield);
          const feed = Number(entry?.total_feed_consumption);
          const scc = Number(entry?.total_scc);

          return {
            date: normalizeDate(entry?.date),
            total_milk_yield: isFinite(milk) ? milk : 0,
            total_feed_consumption: isFinite(feed) ? feed : 0,
            total_scc: isFinite(scc) ? scc : 0,
          };
        });

        const sanitizedRevenue = safeRevenue.map(entry => {
          const milkRevenue = Number(entry?.milk_revenue);
          const feedCost = Number(entry?.feed_cost);

          return {
            date: normalizeDate(entry?.date),
            milk_revenue: isFinite(milkRevenue) ? milkRevenue : 0,
            feed_cost: isFinite(feedCost) ? feedCost : 0,
          };
        });

        // 7️⃣ Save clean data
        setDailyTotals(sanitizedDaily);
        setRevenueData(sanitizedRevenue);

        // 8️⃣ Dashboard Calculations
        const todayStr = today.toISOString().split('T')[0];
        const milkToday =
          sanitizedDaily.find(d => d.date === todayStr)?.total_milk_yield || 0;

        const avgMilk =
          sanitizedDaily.length > 0
            ? sanitizedDaily.reduce((sum, d) => sum + d.total_milk_yield, 0) /
              sanitizedDaily.length
            : 0;

        const avgFeed =
          sanitizedDaily.length > 0
            ? sanitizedDaily.reduce(
                (sum, d) => sum + d.total_feed_consumption,
                0,
              ) / sanitizedDaily.length
            : 0;

        const avgScc =
          sanitizedDaily.length > 0
            ? sanitizedDaily.reduce((sum, d) => sum + d.total_scc, 0) /
              sanitizedDaily.length
            : 0;

        setDashboardData(prev => ({
          ...prev,
          milkToday: isFinite(milkToday) ? milkToday : 0,
          averageYield: isFinite(avgMilk) ? avgMilk : 0,
          averageFeed: isFinite(avgFeed) ? avgFeed : 0,
          averageScc: isFinite(avgScc) ? avgScc : 0,
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

  // helpers to decide if chart has meaningful data
  const hasMilkData = dailyTotals.some(
    d => isFinite(Number(d.total_milk_yield)) && Number(d.total_milk_yield) > 0,
  );
  const hasRevenueData = revenueData.some(
    d => (Number(d.milk_revenue) || 0) > 0 || (Number(d.feed_cost) || 0) > 0,
  );

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

      {/* Milk Stats */}
      <Text style={styles.value}>{safeFixed(dashboardData.milkToday)} L</Text>
      <Text style={styles.subText}>
        Avg Yield/Cow: {safeFixed(dashboardData.averageYield)} L
      </Text>
      <Text style={styles.subText}>
        Lactating Cows: {dashboardData.lactatingAnimals || 0}
      </Text>

      {/* Financials */}
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

      {/* Milk Production Trend */}
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

      {/* Revenue vs Feed Cost */}
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
