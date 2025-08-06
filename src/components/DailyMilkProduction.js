import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Get today's date in 'YYYY-MM-DD' format
const getTodayDate = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const dd = String(today.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const DailyMilkProduction = ({
  records = [],
  setIsMilkModalOpen,
  setIsEditingMilk,
  setMilkForm,
  handleEditMilk,
  canEdit = false,
}) => {
  const today = getTodayDate();

  // Filter for today's records
  const todayRecords = records.filter(record => record.date === today);

  const handleAdd = () => {
    setIsEditingMilk(false);
    setMilkForm({
      date: today,
      session: '',
      milk_yield: '',
      milk_price_per_liter: '',
      feed_consumption: '',
      scc: '',
      fat_percentage: '',
      protein_percentage: '',
    });
    setIsMilkModalOpen(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Daily Milk Production - {today}</Text>

      {todayRecords.length === 0 ? (
        <Text style={styles.noRecords}>No records for today.</Text>
      ) : (
        <ScrollView>
          {todayRecords.map((record, index) => (
            <View key={index} style={styles.recordItem}>
              {canEdit && (
                <TouchableOpacity
                  onPress={() => handleEditMilk(record)}
                  style={styles.editIcon}>
                  <Icon name="pencil" size={16} color="#fff" />
                </TouchableOpacity>
              )}
              <View style={styles.recordText}>
                <Text style={styles.recordLine}>
                  🕒 Session - {record.session}
                </Text>
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Yield (L): </Text>
                  {record.milk_yield}
                </Text>
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Price (per L): </Text>
                  {record.milk_price_per_liter}
                </Text>
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Feed Consumed (kg): </Text>
                  {record.feed_consumption}
                </Text>
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>SCC: </Text>
                  {record.scc}
                </Text>
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Fat %: </Text>
                  {record.fat_percentage}
                </Text>
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Protein %: </Text>
                  {record.protein_percentage}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      {canEdit && (
        <TouchableOpacity onPress={handleAdd} style={styles.fab}>
          <Icon name="plus" size={20} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginTop: 16,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    elevation: 3,
    position: 'relative',
    marginBottom: 60,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#1a3c34',
  },
  recordItem: {
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  recordText: {
    marginBottom: 6,
  },
  recordLine: {
    fontSize: 13,
    color: '#444',
    marginBottom: 2,
  },
  key: {
    fontWeight: 'bold',
    color: '#ffa500',
  },
  editIcon: {
    position: 'absolute',
    top: 6,
    right: 6,
    padding: 4,
    backgroundColor: '#ffa500',
    borderRadius: 4,
    zIndex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#ffa500',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  noRecords: {
    textAlign: 'center',
    color: '#999',
    fontStyle: 'italic',
    marginVertical: 10,
  },
});

export default DailyMilkProduction;
