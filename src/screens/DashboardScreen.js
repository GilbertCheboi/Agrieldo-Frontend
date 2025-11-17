import React, {useState} from 'react';
import {
  View,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import CustomMarker from '../assets/medical.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = () => {
  const [location, setLocation] = useState(null);
  const [vets, setVets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');

  // ----------------- Permissions -----------------
  const requestForegroundPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Agrieldo Location Permission',
          message: 'We need your location so vets can find your farm.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handled by react-native-permissions
  };

  // ----------------- API Calls -----------------
  const fetchAvailableVets = async (latitude, longitude) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await fetch(
        'http://api.agrieldo.com/api/profiles/vets/available/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({latitude, longitude, radius: 15}),
        },
      );
      if (res.ok) {
        const data = await res.json();
        setVets(data);
      }
    } catch (err) {
      console.error('Error fetching vets:', err);
    }
  };

  const requestVet = async () => {
    if (!location) {
      Alert.alert('Error', 'Location is required');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await fetch(
        'http://api.agrieldo.com/api/vet_requests/request/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({location, description}),
        },
      );
      if (res.ok) {
        Alert.alert('Request sent', 'A vet is on the way.');
        setModalVisible(false);
        setDescription('');
      }
    } catch (err) {
      console.error('Error requesting vet:', err);
    }
  };

  // ----------------- Button Flow -----------------
  const handleRequestVetPress = async () => {
    const granted = await requestForegroundPermission();
    if (!granted) {
      Alert.alert(
        'Permission Denied',
        'Location is required to request a vet.',
      );
      return;
    }

    Geolocation.getCurrentPosition(
      pos => {
        const {latitude, longitude} = pos.coords;
        setLocation({latitude, longitude});
        fetchAvailableVets(latitude, longitude);
        setModalVisible(true);
      },
      err => Alert.alert('Location Error', err.message),
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.1,
            longitudeDelta: 0.1,
          }}>
          <Marker coordinate={location} title="Your Location" />
          {vets.map(vet => (
            <Marker
              key={vet.id}
              coordinate={{latitude: vet.latitude, longitude: vet.longitude}}
              image={CustomMarker}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Button title="No Location Yet" disabled />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Request Vet" onPress={handleRequestVetPress} />
      </View>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              placeholder="Describe your issue"
              value={description}
              onChangeText={setDescription}
              style={styles.textInput}
              multiline
            />
            <Button title="Submit Request" onPress={requestVet} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

// ----------------- Styles -----------------
const styles = StyleSheet.create({
  container: {flex: 1},
  map: {width: '100%', height: Dimensions.get('window').height - 100},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffa500aa',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  textInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },
});

export default DashboardScreen;
