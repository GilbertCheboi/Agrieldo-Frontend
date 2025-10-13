import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import FeedAnimalsModal from './modals/FeedAnimalsModal';
import AddFeedModal from './modals/AddFeedModal';
import CreateFeedingPlanModal from './modals/CreateFeedingPlanModal';
import {getFeeds} from '../utils/api';

const {width} = Dimensions.get('window');

const FeedStoreScreen = () => {
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(true);

  // MODALS
  const [addModalOpen, setAddModalOpen] = useState(false); // Top button: Add Feed to Store
  const [createPlanOpen, setCreatePlanOpen] = useState(false); // FAB (+): Create Feeding Plan
  const [feedModalOpen, setFeedModalOpen] = useState(false); // FAB (🍽): Feed Animals

  const fetchFeeds = async () => {
    try {
      const data = await getFeeds();
      setFeeds(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching feeds:', error);
      setFeeds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  const handleFeedAdded = newFeed => {
    setFeeds(prevFeeds => {
      const existingFeedIndex = prevFeeds.findIndex(
        feed => feed.id === newFeed.id,
      );
      if (existingFeedIndex !== -1) {
        const updatedFeeds = [...prevFeeds];
        updatedFeeds[existingFeedIndex] = newFeed;
        return updatedFeeds;
      }
      return [...prevFeeds, newFeed];
    });
  };

  const handleFeedUpdated = () => {
    fetchFeeds();
  };

  const handlePlanCreated = newPlan => {
    // Optional: you could refresh plans elsewhere or toast success
    console.log('Feeding plan created:', newPlan?.name || newPlan);
    setCreatePlanOpen(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffa500" />
        <Text>Loading feeds...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header row with title + Add Feed to Store at top */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Feed Store</Text>
        <TouchableOpacity
          style={styles.addTopButton}
          onPress={() => setAddModalOpen(true)}>
          <Text style={styles.addTopButtonText}>+ Add Feed to Store</Text>
        </TouchableOpacity>
      </View>

      {feeds.length === 0 ? (
        <Text style={styles.emptyText}>
          No feeds in store. Please add a feed.
        </Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator>
          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, styles.colName]}>Feed Name</Text>
              <Text style={[styles.headerCell, styles.colQty]}>
                Quantity (Kg)
              </Text>
              <Text style={[styles.headerCell, styles.colPrice]}>
                Price / Kg
              </Text>
              <Text style={[styles.headerCell, styles.colTotal]}>Total</Text>
            </View>

            {/* Table Rows */}
            <FlatList
              data={feeds}
              keyExtractor={item => item.id.toString()}
              renderItem={({item, index}) => (
                <View
                  style={[
                    styles.tableRow,
                    index % 2 === 0 ? styles.rowEven : styles.rowOdd,
                  ]}>
                  <Text style={[styles.cell, styles.colName]} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={[styles.cell, styles.colQty]}>
                    {item.quantity_kg} kg
                  </Text>
                  <Text style={[styles.cell, styles.colPrice]}>
                    {item.price_per_kg
                      ? `Ksh ${item.price_per_kg.toFixed(2)}`
                      : 'N/A'}
                  </Text>
                  <Text style={[styles.cell, styles.colTotal]}>
                    {item.quantity_kg && item.price_per_kg
                      ? `Ksh ${(item.quantity_kg * item.price_per_kg).toFixed(
                          2,
                        )}`
                      : 'N/A'}
                  </Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
      )}

      {/* Floating Action Buttons */}
      {/* PRIMARY FAB (+) NOW OPENS CREATE FEEDING PLAN */}
      <TouchableOpacity
        style={[styles.fab, styles.fabPrimary]}
        onPress={() => setCreatePlanOpen(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* SECONDARY FAB 🍽 FEED ANIMALS */}
      <TouchableOpacity
        style={[styles.fab, styles.fabSecondary]}
        onPress={() => setFeedModalOpen(true)}>
        <Text style={styles.fabText}>🍽</Text>
      </TouchableOpacity>

      {/* Modals */}
      {/* Top button modal: Add Feed to Store */}
      {/* Top button modal: Add Feed to Store */}
      <Modal visible={addModalOpen} animationType="slide">
        <AddFeedModal
          onClose={() => setAddModalOpen(false)}
          onFeedAdded={handleFeedAdded}
        />
      </Modal>

      {/* Floating (+) modal: Create Feeding Plan */}
      <CreateFeedingPlanModal
        visible={createPlanOpen}
        onClose={() => setCreatePlanOpen(false)}
        onPlanCreated={handlePlanCreated}
      />

      {/* Floating 🍽 modal: Feed Animals */}
      <Modal visible={feedModalOpen} animationType="slide">
        <FeedAnimalsModal
          onClose={() => setFeedModalOpen(false)}
          onFeedUpdated={handleFeedUpdated}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {fontSize: 24, fontWeight: 'bold'},
  addTopButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  addTopButtonText: {color: '#fff', fontWeight: 'bold', fontSize: 14},

  emptyText: {fontSize: 16, color: '#666'},

  table: {
    minWidth: width + 200, // ensures scroll when needed
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ffa500',
  },
  headerCell: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#fff',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  rowEven: {backgroundColor: '#f9f9f9'},
  rowOdd: {backgroundColor: '#fff'},
  cell: {
    fontSize: 14,
    color: '#333',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRightWidth: 1,
    borderColor: '#eee',
    textAlign: 'center',
  },
  colName: {width: 150, textAlign: 'left'},
  colQty: {width: 120, textAlign: 'right'},
  colPrice: {width: 140, textAlign: 'right'},
  colTotal: {width: 160, textAlign: 'right'},

  fab: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  // (+) opens CreateFeedingPlanModal
  fabPrimary: {bottom: 80, right: 20, backgroundColor: '#ffa500'},
  // (🍽) opens FeedAnimalsModal
  fabSecondary: {bottom: 20, right: 20, backgroundColor: '#333'},

  fabText: {fontSize: 24, color: '#fff'},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default FeedStoreScreen;
