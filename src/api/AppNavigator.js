import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import FarmerDrawerNavigator from '../api/FarmerDrawerNavigator';
import VetDrawerNavigator from '../api/VetDrawerNavigator';
import FarmDashboard from '../screens/FarmDashboard'; // ✅ Import the screen

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserType = async () => {
      const type = await AsyncStorage.getItem('user_type');
      setUserType(type);
      setLoading(false);
    };

    checkUserType();
  }, []);

  if (loading) return null; // Optional: You could add a splash screen or loader here

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Education">
        {/* Auth Screens */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />

        {/* Farm Dashboard (accessible by any user if navigated to) */}
        <Stack.Screen
          name="FarmDashboard"
          component={FarmDashboard}
          options={{title: 'Farm Dashboard'}}
        />

        {/* Role-Based Main App Screens */}
        {userType === 'vet' ? (
          <Stack.Screen
            name="VetHome"
            component={VetDrawerNavigator}
            options={{headerShown: false}}
          />
        ) : (
          <Stack.Screen
            name="FarmerHome"
            component={FarmerDrawerNavigator}
            options={{headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
