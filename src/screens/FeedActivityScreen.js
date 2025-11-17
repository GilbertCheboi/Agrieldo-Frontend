import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {getFeedActivity} from '../utils/api';

const FeedActivityScreen = ({route, navigation}) => {
  const {feed} = route.params;
  const [activity, setActivity] = useState([]);
  const [summary, setSummary] = useState({added: 0, consumed: 0, remaining: 0});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const data = await getFeedActivity(feed.id);
        console.log('📦 Feed activity response:', data);

        setActivity(data.logs || []);
        setSummary({
          added: data.summary?.added || 0,
          consumed: data.summary?.consumed || 0,
          remaining: data.summary?.remaining || 0,
        });
      } catch (err) {
        console.error('❌ Error fetching feed activity:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [feed.id]);

  const renderItem = ({item}) => (
    <View style={styles.row}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={[styles.added, {color: '#2e7d32'}]}>
        +{item.added.toFixed(2)} kg
      </Text>
      <Text style={[styles.consumed, {color: '#d32f2f'}]}>
        -{item.consumed.toFixed(2)} kg
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffa500" />
        <Text style={styles.loadingText}>Loading feed activity...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{feed.name}</Text>
      <Text style={styles.subtitle}>
        Store: {feed.store_name || 'N/A'} | Price: {feed.price_per_kg} KSh/kg
      </Text>

      <View style={styles.summaryBox}>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Added</Text>
          <Text style={[styles.value, {color: '#2e7d32'}]}>
            {summary.added.toFixed(2)} kg
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Consumed</Text>
          <Text style={[styles.value, {color: '#d32f2f'}]}>
            {summary.consumed.toFixed(2)} kg
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.label}>Remaining</Text>
          <Text style={[styles.value, {color: '#333'}]}>
            {summary.remaining.toFixed(2)} kg
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Feed Logs</Text>
      {activity.length === 0 ? (
        <Text style={styles.empty}>No logs found.</Text>
      ) : (
        <FlatList
          data={activity}
          renderItem={renderItem}
          keyExtractor={(item, i) => i.toString()}
        />
      )}

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 16},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loadingText: {marginTop: 8, color: '#333'},
  title: {fontSize: 22, fontWeight: '700', color: '#ffa500'},
  subtitle: {fontSize: 13, color: '#666', marginBottom: 10},
  summaryBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f7f7f7',
    padding: 12,
    borderRadius: 8,
  },
  summaryItem: {alignItems: 'center', flex: 1},
  label: {fontSize: 13, color: '#555'},
  value: {fontSize: 16, fontWeight: 'bold'},
  sectionTitle: {
    marginTop: 16,
    marginBottom: 8,
    fontWeight: '700',
    color: '#333',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  date: {flex: 1.5, fontSize: 13, color: '#555'},
  added: {flex: 1, textAlign: 'right', fontWeight: '600'},
  consumed: {flex: 1, textAlign: 'right', fontWeight: '600'},
  empty: {textAlign: 'center', color: '#777', marginTop: 20},
  backBtn: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#ffa500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  backText: {color: '#fff', fontWeight: 'bold'},
});

export default FeedActivityScreen;
