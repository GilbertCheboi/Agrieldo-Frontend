import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
  PermissionsAndroid,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import GetLocation from 'react-native-get-location';
import MapView, {Marker, Circle, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RequestVetModal from './modals/RequestVetModal';
import {requestVet} from '../utils/api';
// -------- Config --------
const RADIUS_KM = 15;
const RADIUS_METERS = RADIUS_KM * 1000;

// Haversine distance (km)
const distanceKm = (lat1, lon1, lat2, lon2) => {
  const toRad = d => (d * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Helper: parse coordinate safely
const parseCoord = v => {
  if (v === undefined || v === null) return NaN;
  const num = Number(typeof v === 'string' ? v.trim() : v);
  return Number.isFinite(num) ? num : NaN;
};

export default function VetRequestsOverviewScreen() {
  const mapRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [vetsRaw, setVetsRaw] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedVet, setSelectedVet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleRequestVet = vet => {
    setSelectedVet(vet);
    setModalVisible(true);
  };

  const handleSubmitRequest = async (vet, {message, signs, animalImage}) => {
    try {
      await requestVet(vet.id, {message, signs, animalImage});
      Alert.alert('Success', `Your request to ${vet.name} has been sent.`);
      setModalVisible(false);
    } catch (err) {
      Alert.alert(
        'Error',
        err.response?.data?.detail || 'Failed to submit vet request.',
      );
    }
  };

  // Fetch vets from backend
  const fetchAvailableVets = async (latitude, longitude) => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await fetch(
        ' http://192.168.100.4:8000/api/profiles/vets/available/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({latitude, longitude}),
        },
      );

      const text = await res.text();
      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch (parseErr) {
        console.warn('❌ Failed parsing vets JSON:', parseErr);
      }

      if (res.ok) {
        setVetsRaw(Array.isArray(data) ? data : []);
      } else {
        Alert.alert('Error', (data && data.detail) || 'Failed to fetch vets.');
      }
    } catch (err) {
      console.error('🔥 Error fetching vets:', err);
    }
  };

  // Ask Android permission
  const ensurePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need your location to show it on the map.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (e) {
        console.warn('Permission error', e);
        return false;
      }
    }
    return true;
  };

  // Get current location
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

      const lat = parseCoord(pos?.latitude ?? pos?.coords?.latitude);
      const lon = parseCoord(pos?.longitude ?? pos?.coords?.longitude);

      console.log('📍 Raw location:', pos);
      console.log('📍 Parsed lat/lon:', lat, lon);

      // ✅ Guard against invalid coordinates
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) {
        console.warn('❌ Invalid coordinates from GetLocation:', lat, lon);
        throw new Error('Invalid coordinates from GetLocation');
      }

      const newLocation = {latitude: lat, longitude: lon};
      const newRegion = {
        latitude: lat,
        longitude: lon,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      // ✅ Set only valid data
      setLocation(newLocation);
      setRegion(newRegion);

      // ✅ Animate map safely
      if (mapRef.current?.animateToRegion) {
        mapRef.current.animateToRegion(newRegion, 700);
      }

      // ✅ Fetch vets only if coords valid
      await fetchAvailableVets(lat, lon);
    } catch (err) {
      console.error('Location error:', err);

      Alert.alert(
        'Location Unavailable',
        'Could not obtain your location. Make sure GPS is enabled.',
        [
          {text: 'Open Settings', onPress: () => Linking.openSettings?.()},
          {text: 'Retry', onPress: getCurrentLocation},
        ],
      );
    } finally {
      setLoading(false);
    }
  };

  // Run once + refresh every 10s
  useEffect(() => {
    getCurrentLocation();
    const interval = setInterval(getCurrentLocation, 10000);
    return () => clearInterval(interval);
  }, []);

  // Filter vets inside radius
  const vetsInRadius = useMemo(() => {
    if (!location || !Array.isArray(vetsRaw)) return [];

    return vetsRaw
      .map(v => {
        const lat = parseCoord(v.latitude ?? v.lat ?? v.coords?.latitude);
        const lon = parseCoord(v.longitude ?? v.lon ?? v.coords?.longitude);

        const distance =
          Number.isFinite(lat) && Number.isFinite(lon)
            ? distanceKm(location.latitude, location.longitude, lat, lon)
            : Infinity;

        return {
          ...v,
          _parsedLatitude: lat,
          _parsedLongitude: lon,
          distanceKm: distance,
        };
      })
      .filter(
        p =>
          Number.isFinite(p._parsedLatitude) &&
          Number.isFinite(p._parsedLongitude) &&
          p.distanceKm <= RADIUS_KM,
      )
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [vetsRaw, location]);

  // Center map on vet
  const centerOnVet = vet => {
    if (!vet || !Number.isFinite(vet._parsedLatitude)) return;
    const r = {
      latitude: vet._parsedLatitude,
      longitude: vet._parsedLongitude,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    };
    setRegion(r);
    if (mapRef.current?.animateToRegion) {
      mapRef.current.animateToRegion(r, 500);
    }
  };

  return (
    <View style={styles.container}>
      {region && location ? (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={region}
            region={region}
            showsUserLocation={false}
            showsMyLocationButton={true}>
            {/* User marker */}
            <Marker
              coordinate={location}
              title="Your Location"
              pinColor="red"
            />

            <Circle
              center={location}
              radius={RADIUS_METERS}
              strokeWidth={2}
              strokeColor="rgba(255,0,0,0.6)"
              fillColor="rgba(255,0,0,0.12)"
            />

            {/* Vet markers */}
            {vetsInRadius.map(vet => (
              <Marker
                key={vet.id ?? `${vet._parsedLatitude}-${vet._parsedLongitude}`}
                coordinate={{
                  latitude: vet._parsedLatitude,
                  longitude: vet._parsedLongitude,
                }}
                title={
                  vet.name
                    ? `${vet.name} • ${vet.distanceKm.toFixed(1)} km`
                    : `${vet.distanceKm.toFixed(1)} km away`
                }>
                <View style={styles.vetMarkerInner} />
              </Marker>
            ))}
          </MapView>

          {/* Vet list */}
          <View style={styles.vetList}>
            <FlatList
              data={vetsInRadius}
              horizontal
              keyExtractor={item =>
                item.id
                  ? String(item.id)
                  : `${item._parsedLatitude}-${item._parsedLongitude}`
              }
              renderItem={({item}) => (
                <View style={styles.vetCard}>
                  <Text style={styles.vetName}>
                    {item.name ?? 'Unnamed Vet'}
                  </Text>
                  <Text style={styles.vetDistance}>
                    {item.distanceKm ? `${item.distanceKm.toFixed(1)} km` : ''}
                  </Text>
                  <View style={styles.vetButtons}>
                    <TouchableOpacity
                      onPress={() => centerOnVet(item)}
                      style={styles.vetBtn}>
                      <Text style={styles.vetBtnText}>Center</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleRequestVet(item)}
                      style={[
                        styles.vetBtn,
                        {
                          marginLeft: 6,
                          borderColor: '#d67321ff',
                          borderWidth: 1,
                        },
                      ]}>
                      <Text style={styles.vetBtnText}>Request</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyTitle}>
                    No vets available nearby
                  </Text>
                  <Text style={styles.emptySubtitle}>
                    Try again later or expand your search radius.
                  </Text>
                </View>
              }
            />
          </View>
        </>
      ) : (
        <View style={styles.loadingContainer}>
          <Button title="Fetching Location..." disabled />
        </View>
      )}

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
      <RequestVetModal
        visible={modalVisible}
        vet={selectedVet}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmitRequest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  map: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vetMarkerInner: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#007bff',
    borderWidth: 2,
    borderColor: 'white',
  },
  vetList: {
    position: 'absolute',
    bottom: 56,
    left: 8,
    right: 8,
    height: 140,
    paddingVertical: 6,
  },

  vetCard: {
    padding: 8,
    marginRight: 8,
    borderRadius: 8,
    minWidth: 160,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#d67321ff',
    backgroundColor: '#e9e7e5ff',
  },

  vetName: {color: '#30d61aff', fontWeight: '600'},
  vetDistance: {color: '#5024eeff', marginTop: 4},
  vetButtons: {flexDirection: 'row', marginTop: 6},
  vetBtn: {
    backgroundColor: '#ffa500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  vetBtnText: {color: '#000', fontWeight: '600'},
});
