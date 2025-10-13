import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ConfirmDeleteModal from '../screens/modals/ConfirmDeleteModal';

const HealthRecords = ({
  healthRecords = [],
  setIsHealthModalOpen,
  setIsEditingHealth,
  setHealthForm,
  handleEditHealth,
  handleDeleteHealth,
  canEdit = false,
}) => {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const handleConfirmDelete = async () => {
    if (recordToDelete) {
      try {
        await handleDeleteHealth(recordToDelete); // wait for backend delete
        Alert.alert('Success', 'Health record deleted successfully'); // 👈 show success alert
      } catch (error) {
        console.error('Error deleting record:', error);
        Alert.alert(
          'Error',
          'Failed to delete health record. Please try again.',
        );
      } finally {
        setConfirmVisible(false);
        setRecordToDelete(null);
      }
    }
  };
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

              {record.type ? (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Record type: </Text>
                  {record.type}
                </Text>
              ) : null}
              {record.details ? (
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
              <>
                <TouchableOpacity
                  onPress={() => handleEditHealth(record)}
                  style={styles.editButton}>
                  <Icon name="pencil" size={18} color="#fff" />
                </TouchableOpacity>

                {/* 👇 Delete icon at bottom-right of each record */}
                <TouchableOpacity
                  onPress={() => {
                    setRecordToDelete(record.id);
                    setConfirmVisible(true);
                  }}
                  style={styles.deleteButton}>
                  <Icon name="delete" size={18} color="#fff" />
                </TouchableOpacity>
              </>
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

      <ConfirmDeleteModal
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirmDelete}
        message="Are you sure you want to delete this health record?"
      />
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
  deleteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    padding: 6,
    backgroundColor: '#e53935', // red color for delete
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
  },
});

export default HealthRecords;
