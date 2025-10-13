import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {updateFarm} from '../../utils/api';

const EditFarmModal = ({visible, onClose, farm, onUpdated}) => {
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [farmType, setFarmType] = useState('Dairy');
  const [farmImage, setFarmImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // preload farm data when modal opens
  useEffect(() => {
    if (farm) {
      setFarmName(farm.name || '');
      setFarmLocation(farm.location || '');
      setFarmType(farm.type || 'Dairy');
      if (farm.image) {
        setFarmImage({uri: ` http://192.168.100.4:8000${farm.image}`}); // preload existing image
      }
    }
  }, [farm]);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.length > 0) {
      setFarmImage(result.assets[0]); // replace preview immediately
    }
  };

  const handleSave = async () => {
    if (!farm?.id) {
      Alert.alert('Error', 'Invalid farm ID.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('name', farmName);
      formData.append('location', farmLocation);
      formData.append('type', farmType);

      if (farmImage && farmImage.uri && !farmImage.uri.includes('http')) {
        formData.append('image', {
          uri: farmImage.uri,
          name: farmImage.fileName || 'farm.jpg',
          type: farmImage.type || 'image/jpeg',
        });
      }

      // update farm
      await updateFarm(farm.id, formData);

      // show success
      Alert.alert('Success', 'Farm updated successfully');

      // refresh list on AccountScreen
      if (onUpdated) onUpdated();

      // close modal
      onClose();
    } catch (error) {
      console.error('Failed to update farm:', error);
      Alert.alert('Error', 'Failed to update farm. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFarmName('');
    setFarmLocation('');
    setFarmType('Dairy');
    setFarmImage(null);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Farm</Text>

          <TextInput
            style={styles.input}
            placeholder="Farm Name"
            value={farmName}
            onChangeText={setFarmName}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={farmLocation}
            onChangeText={setFarmLocation}
          />

          {/* Dropdown for type */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Farm Type</Text>
            <Picker
              selectedValue={farmType}
              onValueChange={setFarmType}
              style={styles.picker}>
              <Picker.Item label="Dairy" value="Dairy" />
              <Picker.Item label="Sheep" value="Sheep" />
              <Picker.Item label="Crop" value="Crop" />
            </Picker>
          </View>

          {/* Image upload */}
          <TouchableOpacity
            style={styles.imageButton}
            onPress={handlePickImage}>
            <Text style={styles.imageButtonText}>
              {farmImage ? 'Change Image' : 'Upload Farm Image'}
            </Text>
          </TouchableOpacity>
          {farmImage && (
            <Image source={{uri: farmImage.uri}} style={styles.previewImage} />
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={loading}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.saveText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default EditFarmModal;

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
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  imageButton: {
    backgroundColor: '#ffa500',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: 'rgba(128,128,128,0.2)',
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
