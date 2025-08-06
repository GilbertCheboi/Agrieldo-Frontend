import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ReproductiveHistory = ({
  records = [],
  setIsReproModalOpen,
  setIsEditingRepro,
  setReproForm,
  handleEditRepro,
  canEdit = false,
}) => {
  const handleAdd = () => {
    setIsEditingRepro(false);
    setReproForm({
      date: '',
      event: '',
      details: '',
      cost: '',
    });
    setIsReproModalOpen(true);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Reproductive History</Text>

      <ScrollView>
        {records.map((record, index) => (
          <View key={index} style={styles.recordItem}>
            {canEdit && (
              <TouchableOpacity
                onPress={() => handleEditRepro(record)}
                style={styles.editButton}>
                <Icon name="pencil" size={16} color="#fff" />
              </TouchableOpacity>
            )}

            <View style={styles.recordText}>
              <Text style={styles.recordLine}>
                {record.date} - {record.event}
              </Text>
              {record.details && (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Details: </Text>
                  {record.details}
                </Text>
              )}
              {record.cost > 0 && (
                <Text style={styles.recordLine}>
                  <Text style={styles.key}>Cost: </Text>Ksh. {record.cost}
                </Text>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {canEdit && (
        <TouchableOpacity onPress={handleAdd} style={styles.fab}>
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
    paddingRight: 24,
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
    top: 6,
    right: 6,
    backgroundColor: '#ffa500',
    padding: 4,
    borderRadius: 4,
    zIndex: 1,
  },
  fab: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#ffa500',
    borderRadius: 18,
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default ReproductiveHistory;
