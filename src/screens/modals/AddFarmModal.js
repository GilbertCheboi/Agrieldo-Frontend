import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import {addNewFarm} from '../../utils/api'; // adjust path

const AddFarmModal = ({visible, onClose, onSave}) => {
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');

  const handleSave = async () => {
    if (!farmName.trim()) {
      alert('Please enter a farm name');
      return;
    }

    const newFarm = {name: farmName, location: farmLocation};

    try {
      await addNewFarm(newFarm);
      onSave(); // refresh farm list
      setFarmName('');
      setFarmLocation('');
    } catch (error) {
      console.error(error);
      alert('Failed to add farm');
    }
  };

  const handleClose = () => {
    setFarmName('');
    setFarmLocation('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add New Farm</Text>

          <TextInput
            style={styles.input}
            placeholder="Farm Name"
            value={farmName}
            onChangeText={setFarmName}
          />
          <TextInput
            style={styles.input}
            placeholder="Location (optional)"
            value={farmLocation}
            onChangeText={setFarmLocation}
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={handleClose}>
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

export default AddFarmModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 20,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'rgba(128,128,128,0.2)', // grayish with opacity
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelText: {
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#ffa500',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    elevation: 2,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
