import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-picker/picker'; // ⬅️ Add this import

const MilkProductionModal = ({
  visible,
  onClose,
  isEditing = false,
  form,
  setForm,
  onSave,
}) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const handleChange = (field, value) => {
    setForm(prev => ({...prev, [field]: value}));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>
            {isEditing ? 'Edit Milk Record' : 'Add Milk Record'}
          </Text>

          {/* Date Picker */}
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <TextInput
              style={styles.input}
              value={form.date}
              placeholder="Date"
              editable={false}
            />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={form?.date ? new Date(form.date) : new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
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

          {/* Session Picker */}
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={form.session}
              onValueChange={value => handleChange('session', value)}
              style={styles.picker}>
              <Picker.Item label="Select Session" value="" enabled={false} />
              <Picker.Item label="MORNING" value="MORNING" />
              <Picker.Item label="AFTERNOON" value="AFTERNOON" />
              <Picker.Item label="EVENING" value="EVENING" />
            </Picker>
          </View>

          <TextInput
            style={styles.input}
            value={form.milk_yield}
            placeholder="Milk Yield (L)"
            keyboardType="numeric"
            onChangeText={text => handleChange('milk_yield', text)}
          />
          <TextInput
            style={styles.input}
            value={form.milk_price_per_liter}
            placeholder="Milk Price Per Liter"
            keyboardType="numeric"
            onChangeText={text => handleChange('milk_price_per_liter', text)}
          />
          <TextInput
            style={styles.input}
            value={form.feed_consumption}
            placeholder="Feed Consumption (kg)"
            keyboardType="numeric"
            onChangeText={text => handleChange('feed_consumption', text)}
          />
          <TextInput
            style={styles.input}
            value={form.scc}
            placeholder="SCC"
            keyboardType="numeric"
            onChangeText={text => handleChange('scc', text)}
          />
          <TextInput
            style={styles.input}
            value={form.fat_percentage}
            placeholder="Fat %"
            keyboardType="numeric"
            onChangeText={text => handleChange('fat_percentage', text)}
          />
          <TextInput
            style={styles.input}
            value={form.protein_percentage}
            placeholder="Protein %"
            keyboardType="numeric"
            onChangeText={text => handleChange('protein_percentage', text)}
          />

          <View style={styles.actions}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={onSave}>
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MilkProductionModal;

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
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 12,
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 50,
    width: '100%',
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
});
