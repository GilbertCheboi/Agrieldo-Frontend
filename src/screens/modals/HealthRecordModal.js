import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HealthRecordModal = ({
  visible,
  onClose,
  isEditing,
  healthForm,
  setHealthForm,
  onSave,
}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (name, value) => {
    setHealthForm(prev => ({...prev, [name]: value}));
  };

  const handleConfirm = date => {
    const formatted = date.toISOString().split('T')[0];
    handleChange('date', formatted);
    setDatePickerVisibility(false);
  };

  const handleSavePress = async () => {
    try {
      setSaving(true);
      await onSave(); // awaits parent API call
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.title}>
              {isEditing ? 'Edit Health Record' : 'Add Health Record'}
            </Text>

            {/* Date Picker */}
            <TouchableOpacity
              style={styles.datePicker}
              onPress={() => setDatePickerVisibility(true)}>
              <Icon name="calendar" size={20} color="#1651e6" />
              <Text style={styles.dateText}>
                {healthForm?.date ? healthForm.date : 'Select Date'}
              </Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={() => setDatePickerVisibility(false)}
            />

            {/* Inputs */}
            <TextInput
              placeholder="Type"
              placeholderTextColor="#888"
              value={healthForm?.type}
              onChangeText={text => handleChange('type', text)}
              style={styles.input}
            />

            <TextInput
              placeholder="Details"
              placeholderTextColor="#888"
              value={healthForm?.details}
              onChangeText={text => handleChange('details', text)}
              style={styles.input}
              multiline
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Is Sick?</Text>
              <Switch
                value={healthForm?.is_sick}
                onValueChange={val => handleChange('is_sick', val)}
              />
            </View>

            <TextInput
              placeholder="Clinical Signs"
              placeholderTextColor="#888"
              value={healthForm?.clinical_signs}
              onChangeText={text => handleChange('clinical_signs', text)}
              style={styles.input}
              multiline
            />

            <TextInput
              placeholder="Diagnosis"
              placeholderTextColor="#888"
              value={healthForm?.diagnosis}
              onChangeText={text => handleChange('diagnosis', text)}
              style={styles.input}
              multiline
            />

            <TextInput
              placeholder="Treatment"
              placeholderTextColor="#888"
              value={healthForm?.treatment}
              onChangeText={text => handleChange('treatment', text)}
              style={styles.input}
              multiline
            />

            <TextInput
              placeholder="Cost (Ksh)"
              placeholderTextColor="#888"
              value={healthForm?.cost?.toString()}
              onChangeText={text => handleChange('cost', text)}
              style={styles.input}
              keyboardType="numeric"
            />

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
                disabled={saving}>
                <Text style={[styles.buttonText, {color: '#333'}]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSavePress}
                disabled={saving}>
                {saving ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default HealthRecordModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    maxHeight: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a3c34',
    marginBottom: 12,
    textAlign: 'center',
  },
  datePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateText: {
    marginLeft: 8,
    color: '#000',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#000',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 14,
    color: '#444',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  saveButton: {
    backgroundColor: '#ffa500',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
