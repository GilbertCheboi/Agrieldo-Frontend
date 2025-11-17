import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const ReproductiveRecordModal = ({
  visible,
  onClose,
  isEditing = false,
  form,
  setForm,
  onSave,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [saving, setSaving] = useState(false); // ✅ loading state

  const handleChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  const handleSavePress = async () => {
    try {
      setSaving(true); // show spinner
      await onSave(); // wait for API
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Reproductive Record' : 'Add Reproductive Record'}
          </Text>

          {/* DATE FIELD */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              value={form?.date ? String(form.date) : ''}
              placeholder="Date"
              placeholderTextColor="#888"
              editable={false}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form?.date ? new Date(form.date) : new Date()}
              mode="date"
              display="default"
              onChange={(e, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  handleChange(
                    'date',
                    selectedDate.toISOString().split('T')[0],
                  );
                }
              }}
            />
          )}

          {/* EVENT */}
          <TextInput
            style={styles.input}
            value={form?.event}
            placeholder="Event (e.g., AI, Natural Breeding)"
            placeholderTextColor="#888"
            onChangeText={text => handleChange('event', text)}
          />

          {/* DETAILS */}
          <TextInput
            style={styles.input}
            value={form?.details}
            placeholder="Details"
            placeholderTextColor="#888"
            onChangeText={text => handleChange('details', text)}
            multiline
          />

          {/* COST */}
          <TextInput
            style={styles.input}
            value={form?.cost}
            placeholder="Cost (Ksh)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            onChangeText={text => handleChange('cost', text)}
          />

          {/* BUTTONS */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              disabled={saving}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSavePress}
              disabled={saving}>
              {saving ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ReproductiveRecordModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    elevation: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a3c34',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelBtn: {
    backgroundColor: '#999',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  saveBtn: {
    backgroundColor: '#ffa500',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  cancelText: {
    color: '#fff',
    fontWeight: '600',
  },
});
