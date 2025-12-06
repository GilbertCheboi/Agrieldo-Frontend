import React, {useCallback} from 'react';
import {
  ScrollView,
  Text,
  Button,
  StyleSheet,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
import BillingGuard from '../components/BillingGuard';

export default function VetRequestPermissionScreen() {
  const navigation = useNavigation();

  const checkAndNavigate = async () => {
    const isAndroid = Platform.OS === 'android';
    const permissions = isAndroid
      ? [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
      : [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE];

    const status = await check(permissions[0]);

    if (status === RESULTS.GRANTED) {
      navigation.reset({
        index: 0,
        routes: [{name: 'VetRequestsOverview'}],
      });
    }
  };

  const requestPermissions = async () => {
    try {
      const isAndroid = Platform.OS === 'android';
      const permissions = isAndroid
        ? [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
        : [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE];

      const result = await request(permissions[0]);

      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          'Permission Blocked',
          'Location permission is blocked. Open settings to allow location access.',
          [
            {text: 'Open Settings', onPress: () => Linking.openSettings()},
            {text: 'Cancel'},
          ],
        );
        return;
      }

      if (result !== RESULTS.GRANTED) {
        Alert.alert(
          'Permission Required',
          'Location access is required to request a vet.',
        );
        return;
      }

      // ✅ Navigate immediately when granted
      navigation.reset({
        index: 0,
        routes: [{name: 'VetRequestsOverview'}],
      });
    } catch (error) {
      console.error('[perm] Permission request error:', error);
      Alert.alert(
        'Error',
        'Something went wrong while requesting location permissions.',
      );
    }
  };

  // ✅ Auto-check permission when screen regains focus (e.g., returning from Settings)
  useFocusEffect(
    useCallback(() => {
      checkAndNavigate();
    }, []),
  );

  return (
    <BillingGuard>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Why We Need Location Access</Text>
        <Text style={styles.body}>
          Agrieldo uses your location to connect you with veterinarians. When
          you request a vet, your farm’s real-time location is shared so they
          can find you quickly.
        </Text>
        <Text style={styles.body}>
          Location access is only used while you are requesting a vet. We do not
          track you in the background.
        </Text>

        <Button title="Allow Location Access" onPress={requestPermissions} />
      </ScrollView>
    </BillingGuard>
  );
}

const styles = StyleSheet.create({
  container: {flexGrow: 1, justifyContent: 'center', padding: 20},
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  body: {fontSize: 15, marginBottom: 15, textAlign: 'center'},
});
