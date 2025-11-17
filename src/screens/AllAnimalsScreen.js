import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FAB} from 'react-native-paper';
import jwt_decode from 'jwt-decode';
import {launchImageLibrary} from 'react-native-image-picker';

// Set up axios instance
const axiosInstance = axios.create({
  baseURL: 'http://api.agrieldo.com/',
});

// Function to check if token is expired
const isTokenExpired = token => {
  if (!token) return true; // If there's no token, consider it expired
  try {
    const decodedToken = jwt_decode(token); // Decode the token
    return decodedToken.exp * 1000 < Date.now(); // Check expiry
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Treat as expired if there's an error
  }
};

// Function to refresh access token
const refreshAccessToken = async () => {
  const refreshToken = await AsyncStorage.getItem('refresh_token');

  const response = await axios.post(
    'http://api.agrieldo.com/api/accounts/api/token/refresh/',
    {
      refresh: refreshToken,
    },
  );

  // Store the new access token
  await AsyncStorage.setItem('access_token', response.data.access);
  return response.data.access; // Return the new access token
};

// Axios request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
  async config => {
    let token = await AsyncStorage.getItem('access_token');

    // Check if the token is expired
    if (isTokenExpired(token)) {
      token = await refreshAccessToken(); // Get new token
    }

    // Add Authorization header
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  error => {
    return Promise.reject(error);
  },
);

const AllAnimalsScreen = ({navigation}) => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [animalType, setAnimalType] = useState('');
  const [newAnimal, setNewAnimal] = useState({
    name: '',
    species: '',
    age: '',
    gender: 'M',
    image: null, // Changed image field to null
  });

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await axiosInstance.get('api/animals/dairy-cows/');
      setAnimals(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch animals:', error);
      Alert.alert('Error', 'Failed to fetch animals');
      setLoading(false);
    }
  };

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.assets && response.assets.length > 0) {
        const source = {
          uri: response.assets[0].uri,
          type: response.assets[0].type,
          name: response.assets[0].fileName || 'animal.jpg',
        };
        setNewAnimal({...newAnimal, image: source});
      }
    });
  };

  const handleAnimalTypeSelect = type => {
    setAnimalType(type);
    setIsTypeModalVisible(false);
    setIsFormModalVisible(true);
  };

  const handleAddAnimal = async () => {
    try {
      const url = `api/animals/${
        animalType === 'Dairy Cow'
          ? 'dairy-cows'
          : animalType === 'Beef Cow'
          ? 'beef-cows'
          : animalType.toLowerCase()
      }/`;

      console.log('API URL:', url);

      // Log the newAnimal object to see the initial data
      console.log('Initial Animal Data:', newAnimal);
      const formData = new FormData();
      formData.append('name', newAnimal.name);
      formData.append('species', newAnimal.species);
      formData.append('tag', newAnimal.tag);
      formData.append('age', newAnimal.age);
      formData.append('gender', newAnimal.gender);
      if (newAnimal.image) {
        formData.append('image', newAnimal.image);
      }

      await axiosInstance.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      fetchAnimals();
      setIsFormModalVisible(false);
      setNewAnimal({name: '', species: '', age: '', gender: 'M', image: null});
    } catch (error) {
      console.error('Failed to add animal:', error);
      Alert.alert('Error', 'Failed to add animal');
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#ffa500" />
        <Text>Loading animals...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={animals}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.animalItem}
            onPress={() =>
              navigation.navigate('AnimalDetails', {animalId: item.id})
            }>
            <Text style={styles.animalName}>
              {item.name} ({item.species})
            </Text>
            <Text>Age: {item.age}</Text>
            <Text>Gender: {item.gender === 'M' ? 'Male' : 'Female'}</Text>
            {item.image && (
              <Image source={{uri: item.image}} style={styles.animalImage} />
            )}
          </TouchableOpacity>
        )}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setIsTypeModalVisible(true)}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isTypeModalVisible}
        onRequestClose={() => setIsTypeModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.typeModalView}>
            <Text style={styles.modalTitle}>Select Animal Type</Text>
            <TouchableOpacity
              onPress={() => handleAnimalTypeSelect('Dairy Cow')}
              style={styles.modalButton}>
              <Text style={styles.buttonText}>Dairy Cow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAnimalTypeSelect('Beef Cow')}
              style={styles.modalButton}>
              <Text style={styles.buttonText}>Beef Cow</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAnimalTypeSelect('Sheep')}
              style={styles.modalButton}>
              <Text style={styles.buttonText}>Sheep</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsTypeModalVisible(false)}
              style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFormModalVisible}
        onRequestClose={() => setIsFormModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.formModalView}>
            <Text style={styles.modalTitle}>Add New {animalType}</Text>
            <TextInput
              placeholder="Animal Name"
              style={styles.input}
              value={newAnimal.name}
              onChangeText={text => setNewAnimal({...newAnimal, name: text})}
            />
            <TextInput
              placeholder="Species Name"
              style={styles.input}
              value={newAnimal.species}
              onChangeText={text => setNewAnimal({...newAnimal, species: text})}
            />
            <TextInput
              placeholder="Tag Name"
              style={styles.input}
              value={newAnimal.tag}
              onChangeText={text => setNewAnimal({...newAnimal, tag: text})}
            />
            <TextInput
              placeholder="Age"
              keyboardType="numeric"
              style={styles.input}
              value={newAnimal.age}
              onChangeText={text => setNewAnimal({...newAnimal, age: text})}
            />
            <TouchableOpacity
              onPress={handleImagePick}
              style={styles.imagePickerButton}>
              <Text style={styles.buttonText}>Pick an Image</Text>
            </TouchableOpacity>
            {newAnimal.image ? (
              <Image
                source={{uri: newAnimal.image.uri}}
                style={styles.selectedImage}
              />
            ) : (
              <Text>No image selected</Text>
            )}
            <Text style={styles.genderLabel}>Gender:</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                onPress={() => setNewAnimal({...newAnimal, gender: 'M'})}
                style={[
                  styles.genderButton,
                  newAnimal.gender === 'M' && styles.selectedGender,
                ]}>
                <Text style={styles.buttonText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNewAnimal({...newAnimal, gender: 'F'})}
                style={[
                  styles.genderButton,
                  newAnimal.gender === 'F' && styles.selectedGender,
                ]}>
                <Text style={styles.buttonText}>Female</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={handleAddAnimal}
              style={styles.modalButton}>
              <Text style={styles.buttonText}>Add Animal</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsFormModalVisible(false)}
              style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4', // Light background for contrast
  },
  animalItem: {
    marginVertical: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff', // White background for the item
    shadowColor: '#000', // Adds shadow to make items pop
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android
  },
  animalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333', // Dark text for readability
  },
  animalImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    marginTop: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#ffa500', // Make FAB button stand out
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
  },
  typeModalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    alignItems: 'center',
    borderColor: '#ffa500',
    borderWidth: 2,
  },
  formModalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 25,
    borderColor: '#ffa500',
    borderWidth: 2,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333', // Dark title color for contrast
  },
  modalButton: {
    backgroundColor: '#ffa500',
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ffa500',
  },
  cancelButton: {
    backgroundColor: '#f44336', // Red color for cancel action
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f44336',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  imagePickerButton: {
    backgroundColor: '#ffa500',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    alignItems: 'center',
    width: '100%',
  },
  selectedImage: {
    width: 120,
    height: 120,
    marginTop: 15,
    borderRadius: 8,
    alignSelf: 'center',
  },
  genderLabel: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 15,
  },
  genderButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    width: '40%',
    alignItems: 'center',
  },
  selectedGender: {
    backgroundColor: '#ffa500',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
});

export default AllAnimalsScreen;
