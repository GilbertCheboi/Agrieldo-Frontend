// EditModal.js
import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const EditModal = ({visible, onClose, farm, onSave}) => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    if (farm) {
      setName(farm.name || '');
      setLocation(farm.location || '');
      setLatitude(farm.latitude || '');
      setLongitude(farm.longitude || '');
      setType(farm.type || '');
    }
  }, [farm]);

  const handleSave = () => {
    const updatedFarm = {
      ...farm,
      name,
      location,
      latitude,
      longitude,
      type,
    };
    onSave(updatedFarm);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Edit Farm</Text>

          <TextInput
            style={styles.input}
            placeholder="Farm Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={styles.input}
            placeholder="Latitude"
            value={latitude}
            onChangeText={setLatitude}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="Longitude"
            value={longitude}
            onChangeText={setLongitude}
            keyboardType="numeric"
          />

          {/* Type Dropdown */}
          {Platform.OS === 'android' ? (
            <View style={styles.pickerWrapper}>
              <Text style={styles.pickerLabel}>Type:</Text>
              <Picker
                selectedValue={type}
                onValueChange={itemValue => setType(itemValue)}
                style={styles.picker}>
                <Picker.Item label="Dairy" value="Dairy" />
                <Picker.Item label="Sheep" value="Sheep" />
                <Picker.Item label="Crop" value="Crop" />
              </Picker>
            </View>
          ) : (
            // For iOS, you might want to use a modal picker instead
            <TextInput
              style={styles.input}
              placeholder="Type"
              value={type}
              onChangeText={setType}
            />
          )}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 12,
  },
  pickerWrapper: {
    marginBottom: 12,
  },
  pickerLabel: {
    marginBottom: 4,
    fontSize: 14,
    color: '#333',
  },
  picker: {
    height: 40,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 16,
  },
  cancelButton: {
    marginRight: 10,
    padding: 10,
  },
  saveButton: {
    backgroundColor: '#ffa500',
    borderRadius: 5,
    padding: 10,
  },
  saveText: {
    color: '#fff',
    fontWeight: '500',
  },
  cancelText: {
    color: '#555',
  },
});
