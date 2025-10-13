// components/ListFeedingPlansModal.js
import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {getFeedingPlans} from '../../utils/api';

const ListFeedingPlansModal = ({visible, onClose}) => {
  const [feedingPlans, setFeedingPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      setLoading(true);
      try {
        const data = await getFeedingPlans();
        setFeedingPlans(data || []);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Failed to load feeding plans');
      } finally {
        setLoading(false);
      }
    };
    if (visible) fetchPlans();
  }, [visible]);

  const renderPlan = ({item}) => (
    <View style={styles.planCard}>
      <Text style={styles.planName}>{item.name}</Text>
      {item.items.map(feed => (
        <Text key={feed.id} style={styles.feedItem}>
          • {feed.feed_name}: {feed.quantity_per_animal} kg
        </Text>
      ))}
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.title}>Feeding Plans</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : feedingPlans.length === 0 ? (
          <Text>No feeding plans found.</Text>
        ) : (
          <ScrollView>
            <FlatList
              data={feedingPlans}
              keyExtractor={item => item.id.toString()}
              renderItem={renderPlan}
            />
          </ScrollView>
        )}

        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 20},
  planCard: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  planName: {fontSize: 18, fontWeight: 'bold', marginBottom: 6},
  feedItem: {fontSize: 14, color: '#555'},
  error: {color: 'red', marginBottom: 10},
  closeBtn: {
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffa500',
    alignItems: 'center',
  },
  closeText: {color: '#fff', fontWeight: 'bold'},
});

export default ListFeedingPlansModal;
