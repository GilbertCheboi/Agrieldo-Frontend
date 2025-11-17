// SellAnimalScreen.js

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';

import {createListing} from '../utils/api';

const SellAnimalScreen = ({route, navigation}) => {
  const {animalId, animal} = route.params;

  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick Image
  const handlePickImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) return;

      if (response.errorCode) {
        Alert.alert('Error', 'Image picker error');
        return;
      }

      const uri = response.assets[0].uri;
      setImageUri(uri);
    });
  };

  const handleSubmit = async () => {
    if (!price) {
      Alert.alert('Missing Field', 'Please enter a selling price.');
      return;
    }

    setLoading(true);

    try {
      await createListing({
        animal: animalId,
        price,
        description,
        imageUri,
      });

      Alert.alert('Success', 'Animal has been listed for sale!');

      navigation.goBack();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not create listing.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>List {animal.name} for Sale</Text>

      {/* Animal Preview */}
      <View style={styles.animalCard}>
        <Text style={styles.animalName}>{animal.name}</Text>
        <Text style={styles.animalInfo}>Breed: {animal.breed || 'N/A'}</Text>
        <Text style={styles.animalInfo}>
          Age: {animal.age || animal.age_in_months || 'N/A'} months
        </Text>
      </View>

      {/* Price Input */}
      <Text style={styles.label}>Selling Price (KES)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* Description */}
      <Text style={styles.label}>Description (Optional)</Text>
      <TextInput
        style={[styles.input, {height: 120}]}
        placeholder="Extra details..."
        value={description}
        multiline
        onChangeText={setDescription}
      />

      {/* Image Picker */}
      <Text style={styles.label}>Upload Image (Optional)</Text>

      {imageUri ? (
        <Image source={{uri: imageUri}} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Ionicons name="image-outline" size={40} color="#aaa" />
          <Text style={{color: '#aaa'}}>No Image Selected</Text>
        </View>
      )}

      <TouchableOpacity style={styles.pickBtn} onPress={handlePickImage}>
        <Ionicons name="camera-outline" size={22} color="#ffa500" />
        <Text style={styles.pickText}>Choose Image</Text>
      </TouchableOpacity>

      {/* Submit */}
      <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitText}>Submit Listing</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SellAnimalScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 20},

  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },

  animalCard: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  animalName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  animalInfo: {color: '#555', marginTop: 4},

  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 5,
    color: '#333',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },

  image: {
    width: '100%',
    height: 220,
    marginVertical: 10,
    borderRadius: 12,
  },

  noImage: {
    height: 180,
    backgroundColor: '#eee',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },

  pickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ffa500',
    borderRadius: 10,
    marginBottom: 25,
  },
  pickText: {
    marginLeft: 10,
    color: '#ffa500',
    fontWeight: '600',
  },

  submitBtn: {
    backgroundColor: '#ffa500',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 40,
  },
  submitText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});
