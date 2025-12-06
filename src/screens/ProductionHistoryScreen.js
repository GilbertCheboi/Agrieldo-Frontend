// ProductionHistoryScreen.js
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Modal,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {fetchDailyMilkProductionSummary} from '../utils/api';
import MilkProductionForm from './MilkProductionForm';

const ITEMS_PER_PAGE = 8;

const ProductionHistoryScreen = () => {
  const [dailyProduction, setDailyProduction] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // 🔄 Load data function used by both focus and pull-to-refresh
  const loadData = async () => {
    try {
      if (!refreshing) setLoading(true);

      const data = await fetchDailyMilkProductionSummary();
      const records = Array.isArray(data) ? data : data.results || [];

      const sortedData = records.sort(
        (a, b) => new Date(b.date) - new Date(a.date),
      );

      setDailyProduction(sortedData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // 🔁 Auto-refresh every time screen is revisited
  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, []),
  );

  // 🔄 Pull to refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const totalPages = Math.ceil(dailyProduction.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = dailyProduction.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333333" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Milk Production History</Text>

      {/* Main ScrollView with Pull to Refresh */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        horizontal={false}>
        <ScrollView horizontal>
          <View>
            {/* Table Header */}
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, {flex: 1.2}]}>Date</Text>
              <Text style={styles.headerCell}>Milk Yield (L)</Text>
              <Text style={styles.headerCell}>Feed (kg)</Text>
              <Text style={styles.headerCell}>Price/L</Text>
              <Text style={styles.headerCell}>Fat %</Text>
              <Text style={styles.headerCell}>Protein %</Text>
              <Text style={styles.headerCell}>SCC</Text>
            </View>

            {/* Table Rows */}
            <ScrollView style={{maxHeight: 450}}>
              {paginatedData.map((item, index) => (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 && {backgroundColor: '#f5f5f5'},
                  ]}>
                  <Text style={[styles.cell, {flex: 1.2}]}>{item.date}</Text>
                  <Text style={styles.cell}>
                    {item.total_milk_yield?.toFixed(2) || 'N/A'}
                  </Text>
                  <Text style={styles.cell}>
                    {item.total_feed_consumption?.toFixed(2) || 'N/A'}
                  </Text>
                  <Text style={styles.cell}>
                    {item.avg_price_per_liter || 'N/A'}
                  </Text>
                  <Text style={styles.cell}>
                    {item.avg_fat_percentage?.toFixed(2) || 'N/A'}
                  </Text>
                  <Text style={styles.cell}>
                    {item.avg_protein_percentage?.toFixed(2) || 'N/A'}
                  </Text>
                  <Text style={styles.cell}>
                    {item.avg_scc?.toFixed(2) || 'N/A'}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </ScrollView>

      {/* Pagination */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          <TouchableOpacity
            disabled={currentPage === 1}
            onPress={() => setCurrentPage(currentPage - 1)}
            style={[styles.pageButton, currentPage === 1 && styles.disabled]}>
            <Text style={styles.pageButtonText}>Previous</Text>
          </TouchableOpacity>

          <Text>
            Page {currentPage} / {totalPages}
          </Text>

          <TouchableOpacity
            disabled={currentPage === totalPages}
            onPress={() => setCurrentPage(currentPage + 1)}
            style={[
              styles.pageButton,
              currentPage === totalPages && styles.disabled,
            ]}>
            <Text style={styles.pageButtonText}>Next</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal for Adding Records */}
      <Modal visible={showModal} animationType="slide">
        <MilkProductionForm onClose={() => setShowModal(false)} />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 14,
    color: '#333333',
    textAlign: 'center',
  },

  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    paddingVertical: 10,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    flex: 1,
    color: '#ffa500',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 13,
  },

  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: '#333',
  },

  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 60,
  },
  pageButton: {
    padding: 8,
    backgroundColor: '#333333',
    borderRadius: 6,
  },
  disabled: {backgroundColor: '#ccc'},
  pageButtonText: {color: '#fff'},

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: '#333333',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  fabText: {color: '#ffa500', fontSize: 28},

  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default ProductionHistoryScreen;
