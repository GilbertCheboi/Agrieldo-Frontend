// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Button,
//   TextInput,
//   Alert,
//   Switch,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';

// const VetRequestScreen = () => {
//   // Dummy farm data directly in the component
//   const farmData = {
//     animals: [
//       {id: '1', name: 'Bessie', species: 'Cow'},
//       {id: '2', name: 'Dolly', species: 'Sheep'},
//       {id: '3', name: 'Cluckers', species: 'Chicken'},
//       {id: '4', name: 'Billy', species: 'Goat'},
//       {id: '5', name: 'Mittens', species: 'Cat'},
//       {id: '6', name: 'Rover', species: 'Dog'},
//     ],
//   };

//   const [selectedAnimal, setSelectedAnimal] = useState('');
//   const [problemDescription, setProblemDescription] = useState('');
//   const [location, setLocation] = useState('');
//   const [isUrgent, setIsUrgent] = useState(false);

//   const handleRequestSubmit = async () => {
//     if (!location) {
//       Alert.alert('Error', 'Please provide your location.');
//       return;
//     }

//     try {
//       const response = await fetch(
//         'http://your-backend-url/api/vet_requests/',
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${yourToken}`, // Replace with your token
//           },
//           body: JSON.stringify({
//             animal: selectedAnimal,
//             description: problemDescription,
//             location: location,
//             is_urgent: isUrgent,
//           }),
//         },
//       );

//       const data = await response.json();

//       if (response.ok) {
//         Alert.alert('Success', 'Your vet request has been submitted.');
//         setSelectedAnimal('');
//         setProblemDescription('');
//         setLocation('');
//         setIsUrgent(false);
//       } else {
//         Alert.alert(
//           'Error',
//           data.detail || 'Something went wrong. Please try again.',
//         );
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Network error. Please check your connection.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Request a Vet</Text>

//       {/* Animal Dropdown */}
//       <Text>Select the Animal with the Problem:</Text>
//       <Picker
//         selectedValue={selectedAnimal}
//         style={styles.picker}
//         onValueChange={itemValue => setSelectedAnimal(itemValue)}>
//         <Picker.Item label="Select an Animal" value="" />
//         {farmData.animals.map(animal => (
//           <Picker.Item
//             key={animal.id}
//             label={`${animal.name} (${animal.species})`}
//             value={animal.id}
//           />
//         ))}
//       </Picker>

//       {/* Problem Description */}
//       <TextInput
//         style={styles.input}
//         placeholder="Describe the problem"
//         value={problemDescription}
//         onChangeText={setProblemDescription}
//         multiline
//       />

//       {/* Location Input */}
//       <TextInput
//         style={styles.input}
//         placeholder="Enter your location"
//         value={location}
//         onChangeText={setLocation}
//       />

//       {/* Urgent Switch */}
//       <View style={styles.switchContainer}>
//         <Text>Is this urgent?</Text>
//         <Switch value={isUrgent} onValueChange={setIsUrgent} />
//       </View>

//       {/* Submit Request Button */}
//       <Button
//         title="Submit Vet Request"
//         onPress={handleRequestSubmit}
//         disabled={!selectedAnimal || !problemDescription || !location}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     marginBottom: 20,
//   },
//   input: {
//     height: 50,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     padding: 10,
//     marginBottom: 20,
//   },
//   switchContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 20,
//   },
// });

// export default VetRequestScreen;

import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {
  fetchIncomingVetRequests,
  handleAccept,
  handleDecline,
} from '../utils/api';

const getStatusColor = status => {
  switch (status) {
    case 'pending':
      return '#ffc107'; // yellow
    case 'accepted':
      return '#28a745'; // green
    case 'rejected':
      return '#dc3545'; // red
    case 'completed':
      return '#6c757d'; // grey
    default:
      return '#007bff'; // blue fallback
  }
};

export default function VetRequestsScreen() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const ensurePermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Location Permission',
          message: 'We need your location to show it on the map.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  const getCurrentLocation = async () => {
    setLoading(true);
    try {
      const ok = await ensurePermission();
      if (!ok) {
        setLoading(false);
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      const pos = await GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      });

      const lat = pos.latitude ?? pos.coords?.latitude;
      const lon = pos.longitude ?? pos.coords?.longitude;

      if (!lat || !lon) throw new Error('Invalid coordinates');

      const newLocation = {latitude: lat, longitude: lon};
      setLocation(newLocation);

      const newRegion = {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };
      setRegion(newRegion);

      if (mapRef.current?.animateToRegion) {
        mapRef.current.animateToRegion(newRegion, 700);
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Location Error', 'Could not get your location.', [
        {text: 'Open Settings', onPress: () => Linking.openSettings?.()},
        {text: 'Retry', onPress: getCurrentLocation},
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();

    const loadRequests = async () => {
      try {
        const data = await fetchIncomingVetRequests();
        // Map backend fields to frontend friendly fields
        const mapped = data.map(r => ({
          ...r,
          farmerName: `Farmer #${r.farmer}`,
          animal: r.signs,
          issue: r.message,
          image: r.animal_image,
          createdAt: new Date(r.created_at).toLocaleString(),
          latitude: r.latitude ?? 0,
          longitude: r.longitude ?? 0,
        }));
        setRequests(mapped);
      } catch (err) {
        console.error('Failed to fetch vet requests:', err);
      }
    };

    loadRequests();
    const interval = setInterval(loadRequests, 10000);
    return () => clearInterval(interval);
  }, []);

  const renderRequest = ({item}) => (
    <View style={styles.requestItem}>
      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          {backgroundColor: getStatusColor(item.status)},
        ]}>
        <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
      </View>
      <View style={styles.requestRow}>
        {item.image && (
          <Image source={{uri: item.image}} style={styles.requestImage} />
        )}
        <View style={styles.requestDetails}>
          <Text style={styles.requestText}>Farmer: {item.farmerName}</Text>
          <Text style={styles.requestText}>Animal: {item.animal}</Text>
          <Text style={styles.requestText}>Issue: {item.issue}</Text>
          <Text style={styles.requestText}>Created: {item.createdAt}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.btn, {backgroundColor: '#28a745'}]}
              onPress={() => handleAccept(item.id)}>
              <Text style={styles.btnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, {backgroundColor: '#dc3545'}]}
              onPress={() => handleDecline(item.id)}>
              <Text style={styles.btnText}>Decline</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}

      {region && location && (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          initialRegion={region}
          showsUserLocation
          showsMyLocationButton>
          {/* Optional manual marker for clarity */}
          {location && (
            <Marker coordinate={location} title="You are here" pinColor="red" />
          )}

          {requests.map(r => (
            <Marker
              key={r.id}
              coordinate={{
                latitude: r.latitude,
                longitude: r.longitude,
              }}
              title={r.farmerName}
              description={`${r.animal} • ${r.issue}`}
            />
          ))}
        </MapView>
      )}

      <View style={styles.requestsContainer}>
        <Text style={styles.requestsHeader}>Incoming Requests</Text>
        <FlatList
          data={requests}
          renderItem={renderRequest}
          keyExtractor={item => item.id.toString()}
          ListEmptyComponent={
            <Text style={{textAlign: 'center', marginTop: 10}}>
              No requests
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {height: 300, width: '100%'},
  requestsContainer: {flex: 1, padding: 12, backgroundColor: '#f5f5f5'},
  requestsHeader: {fontWeight: '700', fontSize: 18, marginBottom: 10},
  requestItem: {
    flex: 1,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 3,
    elevation: 2,
  },
  requestRow: {flexDirection: 'row', alignItems: 'stretch'},
  requestImage: {
    width: 100,
    height: '100%',
    borderRadius: 8,
    marginRight: 10,
  },
  requestDetails: {flex: 1, justifyContent: 'space-between'},
  requestText: {fontSize: 14, marginBottom: 3, flexWrap: 'wrap'},
  buttonContainer: {flexDirection: 'row', marginTop: 6},
  btn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 4,
    alignItems: 'center',
  },
  btnText: {color: '#fff', fontWeight: '600'},
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    zIndex: 10,
  },
  statusBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 5,
  },
  statusText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
