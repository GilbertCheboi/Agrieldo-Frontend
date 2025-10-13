import 'react-native-gesture-handler'; // Ensure this is at the top
import React, {useEffect, useState} from 'react';
import {Alert, ActivityIndicator, View} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import LandingPageScreen from './src/screens/LandingPageScreen';
import VetDrawerNavigator from './src/api/VetDrawerNavigator'; // Import Vet Drawer Navigator
import FarmerDrawerNavigator from './src/api/FarmerDrawerNavigator'; // Import Farmer Drawer Navigator
import VetRequestScreen from './src/screens/VetRequestScreen'; // Import Vet Request Screen
import FarmerRequestScreen from './src/screens/FarmerRequestScreen'; // Import Farmer Request Screen

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null); // Initialize with null for loading state
  const [userType, setUserType] = useState(null);

  // Function to check if user is logged in and set user type
  const checkLoginStatus = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const userType = await AsyncStorage.getItem('user_type');

      if (accessToken && userType) {
        setIsLoggedIn(true);
        setUserType(userType);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error loading login status:', error);
      setIsLoggedIn(false);
    }
  };

  // Call checkLoginStatus on app load
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Function to request and save the FCM token
  const getAndStoreToken = async userType => {
    const token = await messaging().getToken();
    console.log(`${userType} FCM Token:`, token);

    // Send this token to your backend to associate with the user
    try {
      await fetch('http://192.168.100.4:8000/api/accounts/update-fcm-token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({user_type: userType, token}),
      });
    } catch (error) {
      console.error(`Error saving ${userType} FCM token:`, error);
    }
  };

  // Set up notification listeners
  useEffect(() => {
    // Request permission to receive notifications
    messaging()
      .requestPermission()
      .then(() => {
        if (userType) {
          getAndStoreToken(userType);
        }
      });

    // Listen for foreground notifications
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage.notification.title,
        remoteMessage.notification.body,
        [
          {
            text: 'View',
            onPress: () => {
              // Check if the notification contains data for navigation
              if (remoteMessage.data.type === 'vet_request') {
                // Assuming you have access to navigation here
                navigation.navigate('VetRequestScreen'); // Navigate to Vet Request Screen
              } else if (remoteMessage.data.type === 'farmer_request') {
                navigation.navigate('FarmerRequestScreen'); // Navigate to Farmer Request Screen
              }
            },
          },
          {text: 'Cancel'},
        ],
      );
    });

    // Listen for background/quit notifications
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Notification received in background:', remoteMessage);
    });

    // Clean up listeners on component unmount
    return () => {
      unsubscribeForeground();
    };
  }, [userType]); // Add userType as a dependency

  // Show loading spinner while checking login status
  if (isLoggedIn === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#333333" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <NavigationContainer style={{flex: 1, backgroundColor: '#ffffff'}}>
        <GestureHandlerRootView style={{flex: 1, backgroundColor: '#ffffff'}}>
          <Stack.Navigator
            initialRouteName={
              isLoggedIn
                ? userType === 'vet'
                  ? 'VetDrawerNavigator'
                  : 'FarmerDrawerNavigator'
                : 'LandingPageScreen'
            }>
            <Stack.Screen
              name="LandingPageScreen"
              component={LandingPageScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Signup"
              component={SignupScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="VetDrawerNavigator"
              component={VetDrawerNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="FarmerDrawerNavigator"
              component={FarmerDrawerNavigator}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="VetRequestScreen"
              component={VetRequestScreen}
              options={{headerShown: true}}
            />
            <Stack.Screen
              name="FarmerRequestScreen"
              component={FarmerRequestScreen}
              options={{headerShown: true}}
            />
          </Stack.Navigator>
        </GestureHandlerRootView>
      </NavigationContainer>
    </Provider>
  );
}
