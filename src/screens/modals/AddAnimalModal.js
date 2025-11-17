import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  Image,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const AddAnimalModal = ({
  visible,
  onClose,
  formData,
  formErrors,
  handleFormChange,
  handleAddAnimal,
  handleImageChange,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  // Handle date selection
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      handleFormChange('dob', formattedDate);
    }
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
              placeholderTextColor="#0f0f0fa6"
              value={formData.name}
              onChangeText={text => handleFormChange('name', text)}
            />
            {formErrors.name && (
              <Text style={styles.error}>{formErrors.name}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Tag"
              placeholderTextColor="#0f0f0fa6"
              value={formData.tag}
              onChangeText={text => handleFormChange('tag', text)}
            />
            {formErrors.tag && (
              <Text style={styles.error}>{formErrors.tag}</Text>
            )}

            <TextInput
              style={styles.input}
              placeholder="Breed"
              placeholderTextColor="#0f0f0fa6"
              value={formData.breed}
              onChangeText={text => handleFormChange('breed', text)}
            />
            {formErrors.breed && (
              <Text style={styles.error}>{formErrors.breed}</Text>
            )}

            <Text style={styles.label}>Gender</Text>
            <Picker
              selectedValue={formData.gender}
              style={[
                styles.picker,
                formData.gender === '' && {color: '#398659'},
              ]}
              onValueChange={value => handleFormChange('gender', value)}>
              <Picker.Item label="Select Gender" value="" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Male" value="Male" />
            </Picker>

            <Text style={styles.label}>Date of Birth</Text>

            {/* Date picker field */}
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                style={[styles.input, {color: formData.dob ? '#000' : '#999'}]}
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#0f0f0fa6"
                value={formData.dob}
                editable={false}
              />
            </TouchableOpacity>

            {/* Date picker modal */}
            {showDatePicker && (
              <DateTimePicker
                value={
                  formData.dob ? new Date(formData.dob) : new Date('2020-01-01')
                }
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            {formErrors.dob && (
              <Text style={styles.error}>{formErrors.dob}</Text>
            )}

            <Text style={styles.label}>Category</Text>
            <Picker
              selectedValue={formData.category}
              onValueChange={value => handleFormChange('category', value)}
              style={styles.picker}>
              <Picker.Item label="Select Category" value="" color="red" />
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
              style={[
                styles.input,
                {backgroundColor: '#181515ff', color: '#fff'},
              ]}
              value={
                formData.farms.find(f => f.id === formData.farm)?.name ||
                'Current Farm'
              }
              editable={false}
            />

            {/* Image upload */}
            <TouchableOpacity onPress={pickImage} style={styles.input}>
              <Text style={{color: '#9c2121ff'}}>Select Images</Text>
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
    borderColor: '#963636ff',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    color: '#000',
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
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    marginBottom: 8,
    color: '#333',
  },
});

export default AddAnimalModal;
