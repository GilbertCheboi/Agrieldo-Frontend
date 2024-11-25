// src/navigation/VetTabNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import VetRequestsOverviewScreen from '../screens/VetRequestsOverviewScreen';
import VetProfileScreen from '../screens/VetProfileScreen'; // Example Vet-specific screen
import VetSettingsScreen from '../screens/VetSettingsScreen'; // Example Vet-specific screen

const Tab = createBottomTabNavigator();

const VetTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={VetRequestsOverviewScreen} />
      <Tab.Screen name="Vet Profile" component={VetProfileScreen} />
      <Tab.Screen name="Vet Settings" component={VetSettingsScreen} />
    </Tab.Navigator>
  );
};

export default VetTabNavigator;
