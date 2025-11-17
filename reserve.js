import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Button,
  Alert,
  StyleSheet,
  Dimensions,
  Modal,
  TextInput,
  Platform,
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
} from 'react-native';
import MapView, {Marker, Circle} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';

// -------- Config --------
const RADIUS_KM = 15;
const RADIUS_METERS = RADIUS_KM * 1000;

// Wrapper that ensures only the first callback is honored and adds a safety timeout
const getSinglePosition = (options = {}, tag = 'geo') =>
  new Promise((resolve, reject) => {
    let finished = false;
    const onSuccess = pos => {
      if (finished) return;
      finished = true;
      clearTimeout(safetyTimer);
      console.log(`[${tag}] geolocation success:`, pos);
      resolve(pos);
    };
    const onError = err => {
      if (finished) return;
      finished = true;
      clearTimeout(safetyTimer);
      console.warn(`[${tag}] geolocation error:`, err.code, err.message);
      reject(err);
    };

    console.log(`[${tag}] geolocation start (opts):`, options);
    Geolocation.getCurrentPosition(onSuccess, onError, options);

    const safetyTimer = setTimeout(() => {
      if (finished) return;
      finished = true;
      console.warn(`[${tag}] safety timeout triggered`);
      reject({code: 3, message: 'safety timeout (wrapper)'});
    }, (options.timeout || 15000) + 3000);
  });

// Haversine distance (km)
const distanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = d => (d * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function VetRequestsOverviewScreen() {
  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [vets, setVets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAvailableVets = async (latitude, longitude) => {
    try {
      const token = await AsyncStorage.getItem('access_token');

      console.log('🔹 Sending request with:', {
        latitude,
        longitude,
        token: token ? 'Token Present' : 'No Token',
      });

      const res = await fetch(
        'http://api.agreildo.com/api/profiles/vets/available/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({latitude, longitude}),
        },
      );

      console.log('🔹 Raw Response:', res);
      console.log('🔹 Response Status:', res.status);

      const text = await res.text();
      console.log('🔹 Response Body (raw text):', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (parseErr) {
        console.error('❌ JSON parse error:', parseErr);
        data = null;
      }

      if (res.ok) {
        console.log('✅ Parsed Data:', data);
        setVets(Array.isArray(data) ? data : []);
      } else {
        console.error('❌ Error Response:', data);
        Alert.alert('Error', (data && data.detail) || 'Failed to fetch vets.');
      }
    } catch (err) {
      console.error('🔥 Error fetching vets:', err);
    }
  };

  // Check/request runtime permission (Android) or request iOS authorization
  const ensurePermission = async () => {
    if (Platform.OS === 'android') {
      const has = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      if (has) return true;
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Agrieldo Location Permission',
          message: 'We need your location so vets can find your farm.',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } else {
      try {
        Geolocation.requestAuthorization?.('whenInUse');
      } catch (e) {
        console.warn('iOS requestAuthorization failed', e);
      }
      return true;
    }
  };

  // The robust location getter used on mount and when retrying
  const getCurrentLocation = async () => {
    setLoading(true);
    console.log('[Dashboard] starting getCurrentLocation');
    try {
      const ok = await ensurePermission();
      if (!ok) {
        setLoading(false);
        Alert.alert('Permission Denied', 'Location permission is required.');
        return;
      }

      // Try fast network-based fix first
      try {
        const pos = await getSinglePosition(
          {enableHighAccuracy: false, timeout: 8000, maximumAge: 10000},
          'dashboard-low',
        );
        const {latitude, longitude} = pos.coords;
        setLocation({latitude, longitude});
        await fetchAvailableVets(latitude, longitude);
        setLoading(false);
        return;
      } catch (lowErr) {
        console.warn('[dashboard] low-accuracy failed:', lowErr);
      }

      // Fallback: try high accuracy (GPS)
      try {
        const pos2 = await getSinglePosition(
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 0},
          'dashboard-high',
        );
        const {latitude, longitude} = pos2.coords;
        setLocation({latitude, longitude});
        await fetchAvailableVets(latitude, longitude);
        setLoading(false);
        return;
      } catch (highErr) {
        console.warn('[dashboard] high-accuracy failed:', highErr);
      }

      // Both attempts failed
      setLoading(false);
      Alert.alert(
        'Location Unavailable',
        'Could not obtain your location. Make sure Location Services/GPS are enabled and try again.',
        [
          {text: 'Open Settings', onPress: () => Linking.openSettings?.()},
          {text: 'Retry', onPress: getCurrentLocation},
        ],
      );
    } catch (e) {
      setLoading(false);
      console.error('[dashboard] unexpected error getting location:', e);
      Alert.alert('Error', 'Unexpected error getting location.');
    }
  };

  useEffect(() => {
    getCurrentLocation();
    return () => {};
  }, []);

  useEffect(() => {
    if (mapRef.current && location) {
      mapRef.current.animateToRegion(
        {
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        },
        1000, // animation duration (ms)
      );
    }
  }, [location]);

  // Filter vets within 15 km and annotate with distance
  const vetsInRadius = useMemo(() => {
    if (!location) return [];
    return vets
      .map(v => {
        const d = distanceKm(
          location.latitude,
          location.longitude,
          v.latitude,
          v.longitude,
        );
        return {...v, distanceKm: d};
      })
      .filter(v => v.distanceKm <= RADIUS_KM)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [vets, location]);

  // Auto-zoom to fit the 15km circle
  useEffect(() => {
    if (!mapRef.current || !location) return;

    // Convert 15km radius to delta bounds
    const lat = location.latitude;
    const lon = location.longitude;
    const kmPerDegLat = 110.574; // approx
    const kmPerDegLon = 111.32 * Math.cos((lat * Math.PI) / 180); // approx at this latitude
    const latDelta = (RADIUS_KM * 2) / kmPerDegLat; // diameter
    const lonDelta = (RADIUS_KM * 2) / kmPerDegLon;

    const north = {latitude: lat + latDelta / 2, longitude: lon};
    const south = {latitude: lat - latDelta / 2, longitude: lon};
    const east = {latitude: lat, longitude: lon + lonDelta / 2};
    const west = {latitude: lat, longitude: lon - lonDelta / 2};

    // Include some vets (if any) to ensure markers near edge are visible
    const vetCoords = vetsInRadius.slice(0, 5).map(v => ({
      latitude: v.latitude,
      longitude: v.longitude,
    }));

    mapRef.current.fitToCoordinates(
      [location, north, south, east, west, ...vetCoords],
      {
        edgePadding: {top: 60, right: 60, bottom: 60, left: 60},
        animated: true,
      },
    );
  }, [location, vetsInRadius]);

  const requestVet = async () => {
    if (!location) {
      Alert.alert('Error', 'Location is required.');
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
        Alert.alert('Request Sent', 'A vet is on the way.');
        setModalVisible(false);
        setDescription('');
      } else {
        const errorData = await res.json();
        Alert.alert('Error', errorData.error || 'Failed to request vet.');
      }
    } catch (err) {
      console.error('Error requesting vet:', err);
    }
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          provider={MapView.PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}>
          {/* You */}
          <Marker coordinate={location} title="Your Location" />

          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Test Marker"
            description="This should show"
          />

          {/* 15 km radius */}
          <Circle
            center={location}
            radius={RADIUS_METERS}
            strokeWidth={2}
            strokeColor="rgba(0,150,255,0.6)"
            fillColor="rgba(0,150,255,0.15)"
          />

          {/* Vets within radius */}
          {vetsInRadius.map(vet => (
            <Marker
              key={vet.id}
              coordinate={{latitude: vet.latitude, longitude: vet.longitude}}
              title={
                vet.name
                  ? `${vet.name} • ${vet.distanceKm.toFixed(1)} km`
                  : `${vet.distanceKm.toFixed(1)} km away`
              }
              description={
                vet.phone_number ? `Phone: ${vet.phone_number}` : undefined
              }
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loadingContainer}>
          <Button title="Fetching Location..." disabled />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Request Vet" onPress={() => setModalVisible(true)} />
        <Button title="Retry Location" onPress={getCurrentLocation} />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View className="content" style={styles.modalContent}>
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
}

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {width: '100%', height: Dimensions.get('window').height - 100},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
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
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
