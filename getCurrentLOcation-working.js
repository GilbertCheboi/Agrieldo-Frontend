import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator,
  Linking,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import GetLocation from 'react-native-get-location';
import MapView, {Marker, Circle} from 'react-native-maps';

export default function VetRequestsOverviewScreen() {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null); // { latitude, longitude }
  const [loading, setLoading] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

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
        console.warn('Permission request error', e);
        return false;
      }
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

      // robust parsing
      const latitude = Number(pos.latitude ?? pos.lat ?? pos.coords?.latitude);
      const longitude = Number(
        pos.longitude ?? pos.lon ?? pos.coords?.longitude,
      );

      console.log('📍 GetLocation raw:', pos);
      console.log('📍 Parsed coords:', latitude, longitude);

      if (!latitude || !longitude) {
        throw new Error('Invalid coordinates from GetLocation');
      }

      const newLocation = {latitude, longitude};
      setLocation(newLocation);

      // animate to region after a short delay (helps on Android)
      setTimeout(() => {
        if (mapRef.current && mapRef.current.animateToRegion) {
          try {
            mapRef.current.animateToRegion(
              {
                latitude,
                longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              },
              700,
            );
          } catch (e) {
            console.warn('animateToRegion failed', e);
          }
        }
      }, 250);
    } catch (err) {
      console.warn('Location error:', err);
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

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const logState = () => {
    console.log('STATE =>', {
      location,
      mapReady,
      mapLoaded,
      mapRefPresent: !!mapRef.current,
    });
  };

  const center = location
    ? {
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
      }
    : null;

  return (
    <View style={styles.container}>
      {center ? (
        <View style={styles.mapWrapper}>
          <MapView
            ref={ref => {
              mapRef.current = ref;
            }}
            style={styles.map}
            provider={MapView.PROVIDER_GOOGLE}
            initialRegion={{
              latitude: center.latitude,
              longitude: center.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            onMapReady={() => {
              console.log('onMapReady fired');
              setMapReady(true);
            }}
            onMapLoaded={() => {
              console.log('onMapLoaded fired');
              setMapLoaded(true);
            }}
            showsUserLocation={false}
            showsMyLocationButton={true}>
            <Marker
              coordinate={center}
              title="You are here"
              description={`${center.latitude.toFixed(
                6,
              )}, ${center.longitude.toFixed(6)}`}
              pinColor="red"
            />

            <Circle
              center={center}
              radius={2000}
              strokeWidth={2}
              strokeColor="rgba(255,0,0,0.7)"
              fillColor="rgba(255,0,0,0.15)"
            />
          </MapView>

          {/* debug overlay */}
          <View style={styles.debug}>
            <Text style={styles.debugText}>
              {`Lat: ${center.latitude.toFixed(
                6,
              )}  Lon: ${center.longitude.toFixed(6)}`}
            </Text>
            <Text style={styles.debugTextSmall}>
              {`mapReady: ${mapReady}  mapLoaded: ${mapLoaded}`}
            </Text>
          </View>

          {/* fallback center dot only while native map isn't ready */}
          {!mapReady && (
            <View pointerEvents="none" style={styles.centerDotWrapper}>
              <View style={styles.centerDot} />
            </View>
          )}
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <Button title="Fetching Location..." disabled />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Retry Location" onPress={getCurrentLocation} />
        <Button title="Log State" onPress={logState} />
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  mapWrapper: {flex: 1},
  map: {flex: 1},
  loadingContainer: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  buttonContainer: {
    position: 'absolute',
    bottom: 18,
    left: 12,
    right: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  debug: {
    position: 'absolute',
    top: 40,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 6,
  },
  debugText: {color: 'white', fontSize: 12},
  debugTextSmall: {color: 'white', fontSize: 10, marginTop: 2},
  centerDotWrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -6,
    marginTop: -6,
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'red',
    opacity: 0.95,
    borderWidth: 2,
    borderColor: 'white',
  },
});
