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

  // Preload farm data when modal opens
  useEffect(() => {
    if (farm) {
      setFarmName(farm.name || '');
      setFarmLocation(farm.location || '');
      setFarmType(farm.type || 'Dairy');
      if (farm.image) {
        setFarmImage({uri: `http://api.agrieldo.com${farm.image}`}); // preload existing image
      }
    }
  }, [farm]);

  const handlePickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.length > 0) {
      setFarmImage(result.assets[0]); // Replace preview immediately
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

      await updateFarm(farm.id, formData);
      Alert.alert('Success', 'Farm updated successfully');

      if (onUpdated) onUpdated();
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

          {/* Farm Name */}
          <TextInput
            style={styles.input}
            placeholder="Farm Name"
            placeholderTextColor="#888"
            value={farmName}
            onChangeText={setFarmName}
          />

          {/* Farm Location */}
          <TextInput
            style={styles.input}
            placeholder="Location"
            placeholderTextColor="#888"
            value={farmLocation}
            onChangeText={setFarmLocation}
          />

          {/* Farm Type Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.label}>Farm Type</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={farmType}
                onValueChange={setFarmType}
                style={styles.picker}>
                <Picker.Item label="Dairy" value="Dairy" />
                <Picker.Item label="Sheep" value="Sheep" />
                <Picker.Item label="Crop" value="Crop" />
              </Picker>
            </View>
          </View>

          {/* Image Upload */}
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

          {/* Action Buttons */}
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '92%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 6,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
    fontSize: 16,
    color: '#000', // ✅ ensures visible text
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#333',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    color: '#000', // ✅ ensures visible text in dropdown
  },
  imageButton: {
    backgroundColor: '#ffa500',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  imageButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '600',
  },
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#eee',
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
