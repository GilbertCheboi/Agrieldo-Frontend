// import React, {useEffect, useState} from 'react';
// import {View, Text, ActivityIndicator, Dimensions} from 'react-native';
// import {LineChart} from 'react-native-chart-kit';
// import {fetchDailyTotals} from '../utils/api';

// const MilkProductionChart = ({farmId}) => {
//   const [chartData, setChartData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const loadChartData = async () => {
//       try {
//         const today = new Date();
//         const startDate = new Date(today.setDate(today.getDate() - 30))
//           .toISOString()
//           .split('T')[0];
//         const endDate = new Date().toISOString().split('T')[0];
//         const data = await fetchDailyTotals(startDate, endDate);

//         const labels = data.map(entry => entry.date);
//         const values = data.map(entry => entry.total_milk_yield);

//         setChartData({
//           labels,
//           datasets: [{data: values}],
//         });
//       } catch (err) {
//         console.error('MilkProductionChart error:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     loadChartData();
//   }, [farmId]);

//   if (loading) {
//     return <ActivityIndicator size="small" color="#ffa500" />;
//   }

//   if (!chartData) {
//     return <Text style={{color: 'red'}}>No data available</Text>;
//   }

//   return (
//     <View>
//       <LineChart
//         data={chartData}
//         width={Dimensions.get('window').width - 32}
//         height={220}
//         chartConfig={{
//           backgroundGradientFrom: '#ffffff',
//           backgroundGradientTo: '#ffffff',
//           decimalPlaces: 1,
//           color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
//           labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           style: {
//             borderRadius: 16,
//           },
//           propsForDots: {
//             r: '4',
//             strokeWidth: '2',
//             stroke: '#ffa500',
//           },
//         }}
//         bezier
//         style={{borderRadius: 12, marginTop: 12}}
//       />
//     </View>
//   );
// };

// export default MilkProductionChart;

import React, {useEffect, useState} from 'react';
import {View, Text, ActivityIndicator, Dimensions} from 'react-native';
import {LineChart} from 'react-native-chart-kit';
import {fetchDailyTotals} from '../utils/api';

const MilkProductionChart = ({farmId}) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Helper to sanitize entries
  const sanitizeData = rawData => {
    return (rawData || [])
      .filter(entry => {
        const yieldVal = Number(entry?.total_milk_yield);
        return entry?.date && isFinite(yieldVal) && yieldVal >= 0;
      })
      .map(entry => ({
        date: entry.date,
        total_milk_yield: Number(entry.total_milk_yield),
      }));
  };

  useEffect(() => {
    const loadChartData = async () => {
      try {
        const today = new Date();
        const startDate = new Date(today.setDate(today.getDate() - 30))
          .toISOString()
          .split('T')[0];
        const endDate = new Date().toISOString().split('T')[0];

        const rawData = await fetchDailyTotals(startDate, endDate);
        const sanitized = sanitizeData(rawData);

        if (sanitized.length === 0) {
          setChartData(null); // fallback to "no data" message
          return;
        }

        const labels = sanitized.map(entry => entry.date);
        const values = sanitized.map(entry => entry.total_milk_yield);

        setChartData({
          labels,
          datasets: [{data: values}],
        });
      } catch (err) {
        console.error('MilkProductionChart error:', err);
        setChartData(null);
      } finally {
        setLoading(false);
      }
    };

    if (farmId) {
      loadChartData();
    } else {
      console.warn('⚠️ MilkProductionChart mounted without farmId');
      setLoading(false);
    }
  }, [farmId]);

  if (loading) {
    return <ActivityIndicator size="small" color="#ffa500" />;
  }

  if (!chartData || chartData.datasets[0].data.length === 0) {
    return (
      <Text style={{color: '#888', textAlign: 'center', marginTop: 10}}>
        No milk production data available yet.
      </Text>
    );
  }

  return (
    <View>
      <LineChart
        data={chartData}
        width={Dimensions.get('window').width - 32}
        height={220}
        chartConfig={{
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#ffffff',
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: '#ffa500',
          },
        }}
        bezier
        style={{borderRadius: 12, marginTop: 12}}
      />
    </View>
  );
};

export default MilkProductionChart;
