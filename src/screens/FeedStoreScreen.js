import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import FeedAnimalsModal from './modals/FeedAnimalsModal';
import AddFeedModal from './modals/AddFeedModal';
import CreateFeedingPlanModal from './modals/CreateFeedingPlanModal';
import FeedingPlanListModal from './modals/FeedingPlanListModal';
import {getFeeds} from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FeedStoreScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const storeId = route.params?.storeId;

  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [createPlanOpen, setCreatePlanOpen] = useState(false);
  const [feedModalOpen, setFeedModalOpen] = useState(false);
  const [viewPlansOpen, setViewPlansOpen] = useState(false);

  // 🔐 Get current user ID
  const fetchUser = async () => {
    const userId = await AsyncStorage.getItem('user_id');
    setCurrentUserId(Number(userId));
  };

  // 📦 Fetch feeds for the selected store
  const fetchFeeds = async () => {
    if (!storeId) return;

    try {
      setLoading(true);
      console.log('🔄 Fetching feeds for store:', storeId);

      const data = await getFeeds(storeId);
      console.log('📥 Raw API feed data:', JSON.stringify(data, null, 2));

      setFeeds(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('❌ Error fetching feeds:', error.response?.data || error);
      Alert.alert('Error', 'Could not load feeds');
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [storeId, currentUserId]);

  const handleFeedAdded = newFeed => {
    setFeeds(prevFeeds => {
      const existingIndex = prevFeeds.findIndex(f => f.id === newFeed.id);
      if (existingIndex !== -1) {
        const updated = [...prevFeeds];
        updated[existingIndex] = newFeed;
        return updated;
      }
      return [...prevFeeds, newFeed];
    });
  };

  const handleFeedUpdated = () => fetchFeeds();

  const handlePlanCreated = newPlan => {
    console.log('📋 Feeding plan created:', newPlan?.name || newPlan);
    setCreatePlanOpen(false);
    fetchFeeds();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffa500" />
        <Text style={styles.loadingText}>Loading feeds...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 🏠 Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Feed Store</Text>
        <TouchableOpacity
          style={styles.addTopButton}
          onPress={() => setAddModalOpen(true)}>
          <Text style={styles.addTopButtonText}>+ Add Feed</Text>
        </TouchableOpacity>
      </View>

      {/* 📊 Feed Table */}
      {feeds.length === 0 ? (
        <Text style={styles.emptyText}>
          No feeds in this store or you are not authorized to use them.
        </Text>
      ) : (
        <FlatList
          data={feeds}
          keyExtractor={item => item.id.toString()}
          ListHeaderComponent={() => (
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.flex2]}>Feed</Text>
              <Text style={[styles.headerCell, styles.flex1]}>
                Qty in Hand (Kg)
              </Text>
              <Text style={[styles.headerCell, styles.flex1]}>
                Price (Ksh/Kg)
              </Text>
            </View>
          )}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('FeedActivity', {feed: item})}
              style={[
                styles.tableRow,
                index % 2 === 0 ? styles.rowEven : styles.rowOdd,
              ]}>
              <Text style={[styles.cell, styles.flex2]} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={[styles.cell, styles.flex1]}>
                {item.quantity_kg} kg
              </Text>
              <Text style={[styles.cell, styles.flex1]}>
                {item.price_per_kg ? item.price_per_kg.toFixed(2) : 'N/A'}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* ➕ Floating Buttons */}
      <TouchableOpacity
        style={[styles.fab, styles.fabPrimary]}
        onPress={() => setCreatePlanOpen(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.fab, styles.fabTertiary]}
        onPress={() => setViewPlansOpen(true)}>
        <Text style={styles.fabText}>🧾</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.fab, styles.fabSecondary]}
        onPress={() => setFeedModalOpen(true)}>
        <Text style={styles.fabText}>🍽</Text>
      </TouchableOpacity>

      {/* 📋 Feeding Plans Modal */}
      <Modal visible={viewPlansOpen} animationType="slide">
        <FeedingPlanListModal
          storeId={storeId}
          onClose={() => setViewPlansOpen(false)}
        />
      </Modal>

      {/* ➕ Add Feed Modal */}
      <Modal visible={addModalOpen} animationType="slide">
        <AddFeedModal
          storeId={storeId}
          onClose={() => setAddModalOpen(false)}
          onFeedAdded={handleFeedAdded}
        />
      </Modal>

      {/* 📦 Create Feeding Plan */}
      <CreateFeedingPlanModal
        visible={createPlanOpen}
        onClose={() => setCreatePlanOpen(false)}
        onPlanCreated={handlePlanCreated}
        storeId={storeId}
        feeds={feeds}
      />

      {/* 🍽 Feed Animals */}
      <Modal visible={feedModalOpen} animationType="slide">
        <FeedAnimalsModal
          storeId={storeId}
          onClose={() => setFeedModalOpen(false)}
          onFeedUpdated={handleFeedUpdated}
          feeds={feeds}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', paddingHorizontal: 12},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  title: {fontSize: 18, fontWeight: '700', color: '#333'},
  addTopButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  addTopButtonText: {color: '#fff', fontWeight: '600', fontSize: 12},
  emptyText: {fontSize: 13, color: '#666', textAlign: 'center', marginTop: 20},
  loadingText: {fontSize: 13, marginTop: 8, color: '#333'},
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffa500',
    paddingVertical: 8,
  },
  headerCell: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
    textAlign: 'center',
  },
  tableRow: {flexDirection: 'row', paddingVertical: 8, paddingHorizontal: 4},
  cell: {fontSize: 12, color: '#333', textAlign: 'center'},
  rowEven: {backgroundColor: '#f9f9f9'},
  rowOdd: {backgroundColor: '#fff'},
  flex2: {flex: 2, textAlign: 'left', paddingLeft: 8},
  flex1: {flex: 1},
  fab: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  fabTertiary: {backgroundColor: '#2e7d32', bottom: 135, right: 16},
  fabPrimary: {backgroundColor: '#ffa500', bottom: 75, right: 16},
  fabSecondary: {backgroundColor: '#333', bottom: 15, right: 16},
  fabText: {fontSize: 20, color: '#fff', fontWeight: 'bold'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default FeedStoreScreen;
