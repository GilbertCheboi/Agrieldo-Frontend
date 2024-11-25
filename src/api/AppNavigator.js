// src/navigation/AppNavigator.js
import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import FarmerDrawerNavigator from '../api/FarmerDrawerNavigator'; // Import your Farmer Drawer Navigator
import VetDrawerNavigator from '../api/VetDrawerNavigator'; // Import your Vet Drawer Navigator

const Stack = createStackNavigator();

const AppNavigator = () => {
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const checkUserType = async () => {
      const type = await AsyncStorage.getItem('user_type');
      setUserType(type);
    };

    checkUserType();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        {userType === 'vet' ? (
          <Stack.Screen
            name="VetHome"
            component={VetDrawerNavigator}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="FarmerHome"
            component={FarmerDrawerNavigator}
            options={{ headerShown: false }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
