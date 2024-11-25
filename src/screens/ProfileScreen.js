import React, { useState, useEffect } from 'react';

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
  ScrollView
 
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FAB } from 'react-native-paper';
import jwt_decode from 'jwt-decode';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Calendar } from 'react-native-calendars';



const axiosInstance = axios.create({
  baseURL: 'http://104.248.23.245/',
});

// Function to check if token is expired
const isTokenExpired = (token) => {
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

  const response = await axios.post('http://104.248.23.245/api/accounts/api/token/refresh/', {
    refresh: refreshToken,
  });

  // Store the new access token
  await AsyncStorage.setItem('access_token', response.data.access);
  return response.data.access; // Return the new access token
};

// Axios request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = await AsyncStorage.getItem('access_token');

    // Check if the token is expired
    if (isTokenExpired(token)) {
      token = await refreshAccessToken(); // Get new token
    }

    // Add Authorization header
    config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const ProfileScreen = () => {
  const [activeSection, setActiveSection] = useState('production'); 
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTypeModalVisible, setIsTypeModalVisible] = useState(false);
  const [isFormModalVisible, setIsFormModalVisible] = useState(false);
  const [animalType, setAnimalType] = useState('');
  const navigation = useNavigation();

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

  const milkRecords = {
    '2024-10-01': [
      { cowId: 'Cow1', morning: 5, evening: 6 },
      { cowId: 'Cow2', morning: 4, evening: 5 },
    ],
    '2024-10-02': [
      { cowId: 'Cow1', morning: 6, evening: 7 },
      { cowId: 'Cow2', morning: 5, evening: 6 },
    ],
    '2024-10-03': [
      { cowId: 'Cow1', morning: 7, evening: 8 },
      { cowId: 'Cow2', morning: 6, evening: 5 },
    ],
  };

    // Highlight available dates on the calendar
  // Highlight available dates on the calendar
  const markedDates = Object.keys(milkRecords).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: '#50C878', activeOpacity: 0.5 };
    return acc;
  }, {});

  const handleDayPress = (day) => {
    const selectedDate = day.dateString;
    if (milkRecords[selectedDate]) {
      navigation.navigate('MilkDetail', { date: selectedDate, productionDetails: milkRecords[selectedDate] });
    } else {
      Alert.alert('No records', `No milk production records found for ${selectedDate}`);
    }
  };

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
  // 'production', 'animals', or 'feed'
  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
    };

    launchImageLibrary(options, (response) => {
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
        setNewAnimal({ ...newAnimal, image: source });
      }
    });
  };

  const handleAnimalTypeSelect = (type) => {
    setAnimalType(type);
    setIsTypeModalVisible(false);
    setIsFormModalVisible(true);
  };

  const handleAddAnimal = async () => {
    try {
      const url = `api/animals/${animalType === 'Dairy Cow' ? 'dairy-cows' : animalType === 'Beef Cow' ? 'beef-cows' : animalType.toLowerCase()}/`;

      console.log("API URL:", url);
  
      // Log the newAnimal object to see the initial data
      console.log("Initial Animal Data:", newAnimal);
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
      setNewAnimal({ name: '', species: '', age: '', gender: 'M', image: null });
    } catch (error) {
      console.error('Failed to add animal:', error);
      Alert.alert('Error', 'Failed to add animal');
    }
  };
  const [profile, setProfile] = useState({
    first_name: 'Jerry',
    second_name: 'Kemboi',
    phone_number: '+254707787762',
    farm_location: 'Kabenes',
    image: 'https://via.placeholder.com/150',
  });

  const [isEditing, setIsEditing] = useState(false); // To toggle edit mode
  const [updatedProfile, setUpdatedProfile] = useState(profile);
  const [image, setImage] = useState(null);

  const handleProfileUpdate = async () => {
    try {
      // Prepare data to be updated
      const formData = new FormData();
      formData.append('first_name', updatedProfile.first_name);
      formData.append('second_name', updatedProfile.second_name);
      formData.append('phone_number', updatedProfile.phone_number);
      formData.append('farm_location', updatedProfile.farm_location);
      if (image) {
        formData.append('image', {
          uri: image.uri,
          type: image.type,
          name: image.fileName || 'profile.jpg',
        });
      }


      // Make API call to update the profile (replace with actual API endpoint)
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.put('http://104.248.23.245:8000/api/profiles/farmer/profile/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('API Response:', response); // Log the entire response
      console.log('Response Data:', response.data); 
      if (response.data && response.data.user) {

        setProfile(updatedProfile); // Update the profile with the new details
        setIsEditing(false); // Close the edit modal
        Alert.alert('Success', 'Profile updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error.response ? error.response.data : error);
      Alert.alert('Error', 'An error occurred while updating the profile');
    }
  };
  const ProductionDetails = () => (
    <View style={styles.container1}>
      <Text style={styles.title}>Milk Records</Text>
      <View style={styles.calendarContainer}>
        <Calendar
          onDayPress={handleDayPress}
          markedDates={markedDates}
          theme={{
            backgroundColor: '#ffffff',
            calendarBackground: '#f0f0f5',
            textSectionTitleColor: '#b6c1cd',
            selectedDayBackgroundColor: '#50C878',
            selectedDayTextColor: '#ffffff',
            todayTextColor: '#FF6347',
            dayTextColor: '#2d4150',
            arrowColor: '#FF6347',
            monthTextColor: '#FF6347',
            textDayFontFamily: 'Arial',
            textMonthFontFamily: 'Arial',
            textDayHeaderFontFamily: 'Arial',
            textDayFontSize: 16,
            textMonthFontSize: 18,
            textDayHeaderFontSize: 14,
          }}
        />
      </View>
    </View>
  );

  const AnimalList = () => (
    <View style={styles.container}>
      <FlatList
        data={animals}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.animalItem}
            onPress={() => navigation.navigate('AnimalDetails', { animalId: item.id })}
          >
            <Text style={styles.animalName}>{item.name} ({item.species})</Text>
            <Text>Age: {item.age}</Text>
            <Text>Gender: {item.gender === 'M' ? 'Male' : 'Female'}</Text>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.animalImage} />
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
        onRequestClose={() => setIsTypeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.typeModalView}>
            <Text style={styles.modalTitle}>Add Animal to my Farm</Text>
            <TouchableOpacity onPress={() => handleAnimalTypeSelect('Dairy Cow')} style={styles.modalButton}>
              <Text style={styles.buttonText}>Dairy Cow</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAnimalTypeSelect('Beef Cow')} style={styles.modalButton}>
              <Text style={styles.buttonText}>Beef Cow</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAnimalTypeSelect('Sheep')} style={styles.modalButton}>
              <Text style={styles.buttonText}>Sheep</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsTypeModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isFormModalVisible}
        onRequestClose={() => setIsFormModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.formModalView}>
            <Text style={styles.modalTitle}>Add New {animalType}</Text>
            <TextInput
              placeholder="Animal Name"
              style={styles.input}
              value={newAnimal.name}
              onChangeText={(text) => setNewAnimal({ ...newAnimal, name: text })}
            />
            <TextInput
              placeholder="Species Name"
              style={styles.input}
              value={newAnimal.species}
              onChangeText={(text) => setNewAnimal({ ...newAnimal, species: text })}
            />
            <TextInput
              placeholder="Tag Name"
              style={styles.input}
              value={newAnimal.tag}
              onChangeText={(text) => setNewAnimal({ ...newAnimal, tag: text })}
            />
            <TextInput
              placeholder="Age"
              keyboardType="numeric"
              style={styles.input}
              value={newAnimal.age}
              onChangeText={(text) => setNewAnimal({ ...newAnimal, age: text })}
            />
            <TouchableOpacity onPress={handleImagePick} style={styles.imagePickerButton}>
              <Text style={styles.buttonText}>Pick an Image</Text>
            </TouchableOpacity>
            {newAnimal.image ? (
              <Image source={{ uri: newAnimal.image.uri }} style={styles.selectedImage} />
            ) : (
              <Text>No image selected</Text>
            )}
            <Text style={styles.genderLabel}>Gender:</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity onPress={() => setNewAnimal({ ...newAnimal, gender: 'M' })} style={[styles.genderButton, newAnimal.gender === 'M' && styles.selectedGender]}>
                <Text style={styles.buttonText}>Male</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setNewAnimal({ ...newAnimal, gender: 'F' })} style={[styles.genderButton, newAnimal.gender === 'F' && styles.selectedGender]}>
                <Text style={styles.buttonText}>Female</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={handleAddAnimal} style={styles.modalButton}>
              <Text style={styles.buttonText}>Add Animal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsFormModalVisible(false)} style={styles.cancelButton}>
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  const feedData = {
    '2024-11-20': { Hay: '200 bales', Silage: '100 tons', Concentrates: '500 kg' },
    '2024-11-21': { Hay: '180 bales', Silage: '120 tons', Concentrates: '450 kg' },
    '2024-11-22': { Hay: '220 bales', Silage: '110 tons', Concentrates: '550 kg' },
  };
  
  const feedTypes = ['Hay', 'Silage', 'Concentrates'];
  
  // Helper function to get the day of the week
  const getDayOfWeek = (dateString) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  };
  
  const FeedRecords = () => (
    <View style={styles.container2}>
      <Text style={styles.title2}>Feed Records</Text>
      <ScrollView horizontal>
        <View>
          {/* Table Header */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.headerCell, styles.dateColumn]}>Date</Text>
            {feedTypes.map((feedType, index) => (
              <Text key={index} style={[styles.cell, styles.headerCell]}>
                {feedType}
              </Text>
            ))}
          </View>
  
          {/* Table Rows */}
          {Object.entries(feedData).map(([date, feeds], rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              <View style={[styles.cell, styles.rowHeader, styles.dateColumn]}>
                <Text>{date}</Text>
                <Text style={styles.dayOfWeek}>{getDayOfWeek(date)}</Text>
              </View>
              {feedTypes.map((feedType, colIndex) => (
                <Text key={colIndex} style={styles.cell}>
                  {feeds[feedType] || '-'}
                </Text>
              ))}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Profile Header */}
      <View style={styles.profileContainer}>
        <Image
          source={{ uri: profile.image }}
          style={styles.profilePic}
        />
        <Text style={styles.name}>{profile.first_name} {profile.second_name}</Text>
        <Text style={styles.location}>📍 {profile.farm_location}</Text>
        <Text style={styles.contact}>📞 {profile.phone_number}</Text>
        <TouchableOpacity onPress={() => setIsEditing(true)} style={{ marginBottom: 20 }}>
        <Text style={{ color: 'blue' }}>Edit Profile</Text>
      </TouchableOpacity>
      </View>


      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditing}
        onRequestClose={() => setIsEditing(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: 300 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Edit Profile</Text>
            <TextInput
              style={{ borderBottomWidth: 1, marginVertical: 10 }}
              placeholder="First Name"
              value={updatedProfile.first_name}
              onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, first_name: text })}
            />
            <TextInput
              style={{ borderBottomWidth: 1, marginVertical: 10 }}
              placeholder="Second Name"
              value={updatedProfile.second_name}
              onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, second_name: text })}
            />
            <TextInput
              style={{ borderBottomWidth: 1, marginVertical: 10 }}
              placeholder="Phone Number"
              value={updatedProfile.phone_number}
              onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, phone_number: text })}
            />
            <TextInput
              style={{ borderBottomWidth: 1, marginVertical: 10 }}
              placeholder="Farm Location"
              value={updatedProfile.farm_location}
              onChangeText={(text) => setUpdatedProfile({ ...updatedProfile, farm_location: text })}
            />
            <TouchableOpacity onPress={handleImagePick} style={{ marginVertical: 10 }}>
              <Text style={{ color: 'blue' }}>Pick a Profile Image</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image.uri }} style={{ width: 100, height: 100, borderRadius: 50 }} />}
            <TouchableOpacity onPress={handleProfileUpdate} style={{ marginTop: 20, backgroundColor: 'green', padding: 10, borderRadius: 5 }}>
              <Text style={{ color: 'white' }}>Update Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setIsEditing(false)} style={{ marginTop: 10 }}>
              <Text style={{ color: 'red' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* Buttons for switching sections */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeSection === 'production' && styles.activeButton,
            ]}
            onPress={() => setActiveSection('production')}
          >
            <Text style={styles.buttonText}>Production Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeSection === 'animals' && styles.activeButton,
            ]}
            onPress={() => setActiveSection('animals')}
          >
            <Text style={styles.buttonText}>My Animals</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tabButton,
              activeSection === 'feed' && styles.activeButton,
            ]}
            onPress={() => setActiveSection('feed')}
          >
            <Text style={styles.buttonText}>Feed Records</Text>
          </TouchableOpacity>
        </View>

      {/* Display the selected section */}
      {activeSection === 'production' && <ProductionDetails />}
      {activeSection === 'animals' && <AnimalList />}
      {activeSection === 'feed' && <FeedRecords />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
  },
  profileContainer: {
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  location: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  contact: {
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly', // Even space between buttons
    flexWrap: 'wrap', // Allow buttons to wrap when they overflow
    marginVertical: 10, // Reduce spacing between the container and other elements
    paddingHorizontal: 10, // Add horizontal padding to prevent button overflow
  },
  tabButton: {
    paddingVertical: 8, // Adjust vertical padding for a smaller height
    paddingHorizontal: 16, // Adjust horizontal padding for smaller width
    marginHorizontal: 4, // Space between buttons
    borderRadius: 12, // Keep button shape
    backgroundColor: '#333333', // Dark gray background color
    minWidth: 120, // Ensure buttons are not too narrow
    alignItems: 'center', // Center text inside button
  },
  activeButton: {
    backgroundColor: '#ffa500', // Highlight active button
  },
  buttonText: {
    fontSize: 12, // Reduce font size for smaller text
    fontWeight: 'bold',
    color: '#333', // Text color
  },
  section: {
    flex: 1,
    padding: 16,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    color: '#555',
    marginVertical: 2,
  
  },

  container1: {
    flex: 1,
    backgroundColor: '#f0f8ff', // Light blue background to create a soft look
    padding: 20,
  },

  animalItem: {
    marginVertical: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff', // White background for the item
    shadowColor: '#000', // Adds shadow to make items pop
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5, // Elevation for Android
  },
  animalName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',  // Dark text for readability
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,  // Elevation for Android
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Semi-transparent overlay
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
  
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  calendarContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  container2: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title2: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cell: {
    minWidth: 80, // Ensure enough width for each column
    padding: 8,
    textAlign: 'center',
    fontSize: 14,
    color: '#333',
  },
  headerCell: {
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
  },
  rowHeader: {
    fontWeight: 'bold',
    textAlign: 'left',
    backgroundColor: '#f9f9f9',
  },
  dateColumn: {
    minWidth: 120, // Wider column for dates
    textAlign: 'left',
  },
  dayOfWeek: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default ProfileScreen;
