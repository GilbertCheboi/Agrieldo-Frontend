import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LactationRecords = ({
  records = [],
  setIsLactationModalOpen,
  setIsEditingLactation,
  setLactationForm,
  handleEditLactation,
  canEdit = false,
}) => {
  const handleAdd = () => {
    setIsEditingLactation(false);
    setLactationForm({
      lactation_number: '',
      last_calving_date: '',
      is_milking: true,
      end_date: '',
    });
    setIsLactationModalOpen(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Lactation Records</Text>

      <ScrollView>
        {records.map((record, index) => (
          <View key={index} style={styles.recordItem}>
            {canEdit && (
              <TouchableOpacity
                onPress={() => handleEditLactation(record)}
                style={styles.editIcon}>
                <Icon name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
            )}
            <View style={styles.recordText}>
              <Text style={styles.recordLine}>
                🍼 Lactation Number - {record.lactation_number}
              </Text>
              <Text style={styles.recordLine}>
                <Text style={styles.key}>Calving Date: </Text>
                {record.last_calving_date}
              </Text>
              <Text style={styles.recordLine}>
                <Text style={styles.key}>Days in Milk: </Text>
                {record.days_in_milk}
              </Text>
              <Text style={styles.recordLine}>
                <Text style={styles.key}>Milking: </Text>
                {record.is_milking ? 'Yes' : 'No'}
              </Text>
              {record.expected_calving_date && (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Expected Calving Date: </Text>
                  {record.expected_calving_date}
                </Text>
              )}
              {record.end_date && (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>End Date: </Text>
                  {record.end_date}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

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
    marginBottom: 20, // Leave space for + button outside card
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
});

export default LactationRecords;
