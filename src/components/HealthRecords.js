import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HealthRecords = ({
  healthRecords = [],
  setIsHealthModalOpen,
  setIsEditingHealth,
  setHealthForm,
  handleEditHealth,
  canEdit = false,
}) => {
  const handleAdd = () => {
    setIsEditingHealth(false);
    setHealthForm({
      date: '',
      type: '',
      details: '',
      is_sick: false,
      clinical_signs: '',
      diagnosis: '',
      treatment: '',
      cost: '',
    });
    setIsHealthModalOpen(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Health Records</Text>

      <ScrollView>
        {healthRecords.map((record, index) => (
          <View key={index} style={styles.recordItem}>
            <View style={styles.recordText}>
              <View style={styles.dateLineContainer}>
                <Icon name="calendar" size={18} color="#1651e6" />
                <Text style={styles.dateText}> {record.date}</Text>
              </View>

              {record.clinical_signs ? (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Record type: </Text>
                  {record.type}
                </Text>
              ) : null}
              {record.clinical_signs ? (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Details: </Text>
                  {record.details}
                </Text>
              ) : null}

              {record.clinical_signs ? (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Signs: </Text>
                  {record.clinical_signs}
                </Text>
              ) : null}
              {record.diagnosis ? (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Diagnosis: </Text>
                  {record.diagnosis}
                </Text>
              ) : null}
              {record.treatment ? (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Treatment: </Text>
                  {record.treatment}
                </Text>
              ) : null}
              {record.cost ? (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Cost: </Text>
                  Ksh. {record.cost}
                </Text>
              ) : null}
            </View>

            {canEdit && (
              <TouchableOpacity
                onPress={() => handleEditHealth(record)}
                style={styles.editButton}>
                <Icon name="pencil" size={18} color="#fff" />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </ScrollView>

      {canEdit && (
        <TouchableOpacity
          onPress={handleAdd}
          style={styles.fab}
          title="Add Health Record">
          <Icon name="plus" size={18} color="#fff" />
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
    position: 'relative',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#1a3c34',
  },
  dateLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#444',
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
  dateLine: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 4,
  },
  detailLine: {
    fontSize: 13,
    color: '#444',
    marginBottom: 4,
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
  editButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 6,
    backgroundColor: '#ffa500',
    borderRadius: 20,
  },
  fab: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: '#46cf50',
    borderRadius: 20,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
});

export default HealthRecords;
