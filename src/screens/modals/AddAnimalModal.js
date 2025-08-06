import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import {Image} from 'react-native';

const AddAnimalModal = ({
  visible,
  onClose,
  formData,
  formErrors,
  handleFormChange,
  handleAddAnimal,
  handleImageChange,
}) => {
  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo', selectionLimit: 5}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('Image Picker Error:', response.errorMessage);
      } else if (response.assets) {
        const files = response.assets.map(asset => ({
          uri: asset.uri,
          name: asset.fileName,
          type: asset.type,
        }));
        handleImageChange(files);
      }
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <ScrollView>
            <Text style={styles.title}>Add New Animal</Text>

            <TextInput
              style={styles.input}
              placeholder="Animal Name"
              value={formData.name}
              onChangeText={text => handleFormChange('name', text)}
            />
            {formErrors.name && (
              <Text style={styles.error}>{formErrors.name}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Tag"
              value={formData.tag}
              onChangeText={text => handleFormChange('tag', text)}
            />
            {formErrors.tag && (
              <Text style={styles.error}>{formErrors.tag}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Breed"
              value={formData.breed}
              onChangeText={text => handleFormChange('breed', text)}
            />
            {formErrors.breed && (
              <Text style={styles.error}>{formErrors.breed}</Text>
            )}

            <Text style={styles.label}>Gender</Text>
            <Picker
              selectedValue={formData.gender}
              onValueChange={value => handleFormChange('gender', value)}>
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Male" value="Male" />
            </Picker>

            <Text style={styles.label}>Date of Birth</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              value={formData.dob}
              onChangeText={text => handleFormChange('dob', text)}
            />
            {formErrors.dob && (
              <Text style={styles.error}>{formErrors.dob}</Text>
            )}

            <Text style={styles.label}>Category</Text>
            <Picker
              selectedValue={formData.category}
              onValueChange={value => handleFormChange('category', value)}>
              <Picker.Item label="Select Category" value="" />
              {[
                'Calf (0-3 months)',
                'Weaner Stage 1 (3-6 months)',
                'Weaner Stage 2 (6-9 months)',
                'Yearling (9-12 months)',
                'Bulling (12-15 months)',
                'Heifer',
                'In-Calf',
                'Steaming',
                'Early Lactating',
                'Mid Lactating',
                'Late Lactating',
                'Dry',
                'Bull',
              ].map(option => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>

            <Text style={styles.label}>Farm</Text>
            <TextInput
              style={[styles.input, {backgroundColor: '#f0f0f0'}]}
              value={
                formData.farms.find(f => f.id === formData.farm)?.name ||
                'Current Farm'
              }
              editable={false}
            />

            {/* Image upload simulation */}
            <TouchableOpacity onPress={pickImage} style={styles.input}>
              <Text style={{color: '#333'}}>Select Images</Text>
            </TouchableOpacity>

            <ScrollView horizontal>
              {formData.images.map((img, idx) => (
                <Image
                  key={idx}
                  source={{uri: img.uri}}
                  style={{
                    width: 50,
                    height: 50,
                    marginRight: 8,
                    borderRadius: 6,
                  }}
                />
              ))}
            </ScrollView>

            <View style={styles.buttonRow}>
              <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddAnimal}
                disabled={formData.farms.length === 0 || !formData.farm}>
                <Text style={styles.buttonText}>Add Animal</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    padding: 16,
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
    marginBottom: 12,
    color: '#1a3c34',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 8,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600',
    color: '#333',
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  addButton: {
    backgroundColor: '#ffa500',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddAnimalModal;
