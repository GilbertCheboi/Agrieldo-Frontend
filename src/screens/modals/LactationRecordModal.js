import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const LactationRecordModal = ({
  visible,
  onClose,
  isEditing = false,
  form,
  setForm,
  onSave,
}) => {
  const [showCalvingPicker, setShowCalvingPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [saving, setSaving] = useState(false); // ⭐ loading indicator

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
            {isEditing ? 'Edit Lactation Record' : 'Add Lactation Record'}
          </Text>

          {/* Lactation Number */}
          <TextInput
            style={styles.input}
            value={String(form?.lactation_number || '')}
            placeholder="Lactation Number"
            placeholderTextColor="#888"
            keyboardType="numeric"
            onChangeText={text =>
              handleChange('lactation_number', parseInt(text))
            }
          />

          {/* Calving Date */}
          <TouchableOpacity onPress={() => setShowCalvingPicker(true)}>
            <TextInput
              style={styles.input}
              value={form?.last_calving_date || ''}
              placeholder="Last Calving Date"
              placeholderTextColor="#888"
              editable={false}
            />
          </TouchableOpacity>

          {showCalvingPicker && (
            <DateTimePicker
              value={
                form?.last_calving_date
                  ? new Date(form.last_calving_date)
                  : new Date()
              }
              mode="date"
              display="default"
              onChange={(e, selectedDate) => {
                setShowCalvingPicker(false);
                if (selectedDate) {
                  handleChange(
                    'last_calving_date',
                    selectedDate.toISOString().split('T')[0],
                  );
                }
              }}
            />
          )}

          {/* End Date */}
          {/* <TouchableOpacity onPress={() => setShowEndPicker(true)}>
            <TextInput
              style={styles.input}
              value={form?.end_date || ''}
              placeholder="End Date (optional)"
              placeholderTextColor="#888"
              editable={false}
            />
          </TouchableOpacity> */}

          {showEndPicker && (
            <DateTimePicker
              value={form?.end_date ? new Date(form.end_date) : new Date()}
              mode="date"
              display="default"
              onChange={(e, selectedDate) => {
                setShowEndPicker(false);
                if (selectedDate) {
                  handleChange(
                    'end_date',
                    selectedDate.toISOString().split('T')[0],
                  );
                }
              }}
            />
          )}

          {/* Is Milking */}
          <View style={styles.switchRow}>
            <Text style={styles.label}>Is Milking?</Text>
            <Switch
              value={form?.is_milking}
              onValueChange={val => handleChange('is_milking', val)}
            />
          </View>

          {/* Action Buttons */}
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

export default LactationRecordModal;

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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 14,
    color: '#333',
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
