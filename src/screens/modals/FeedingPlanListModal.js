import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {getFeedingPlans} from '../../utils/api';

const FeedingPlanListModal = ({storeId, onClose}) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const data = await getFeedingPlans(storeId);
      console.log('📋 Plans fetched:', JSON.stringify(data, null, 2));
      setPlans(Array.isArray(data) ? data : data?.plans || []);
    } catch (err) {
      console.error('❌ Error fetching feeding plans:', err);
      Alert.alert('Error', 'Could not load feeding plans.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [storeId]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feeding Plans</Text>

      {loading ? (
        <ActivityIndicator color="#ffa500" size="large" />
      ) : plans.length === 0 ? (
        <Text style={styles.emptyText}>
          No feeding plans found for this store.
        </Text>
      ) : (
        <ScrollView>
          {plans.map(plan => (
            <View key={plan.id} style={styles.planCard}>
              <Text style={styles.planName}>📘 {plan.name}</Text>
              {plan.items && plan.items.length > 0 ? (
                plan.items.map((item, idx) => (
                  <View key={idx} style={styles.feedItem}>
                    <Text style={styles.feedText}>• {item.feed_name}</Text>
                    <Text style={styles.feedDetails}>
                      {item.quantity_per_animal} kg/animal
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noItems}>No feeds linked</Text>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  planCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#ffa500',
  },
  planName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 6,
  },
  feedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  feedText: {fontSize: 14, color: '#444'},
  feedDetails: {fontSize: 13, color: '#555'},
  noItems: {fontSize: 13, color: '#999', fontStyle: 'italic'},
  closeButton: {
    backgroundColor: '#333',
    marginTop: 20,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {color: '#fff', fontWeight: 'bold'},
  emptyText: {textAlign: 'center', color: '#777', marginTop: 20, fontSize: 14},
});

export default FeedingPlanListModal;
