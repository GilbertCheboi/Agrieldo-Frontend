// File: src/navigation/FarmerTabNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PremiumScreen from '../screens/PremiumScreen';
import MessagingScreen from '../screens/MessagingScreen'; // Import the Messaging screen
import Icon from 'react-native-vector-icons/Ionicons'; // Import Ionicons

const Tab = createBottomTabNavigator();

const FarmerTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ffa500', // Active tab color
        tabBarInactiveTintColor: '#333333', // Inactive tab color
        tabBarStyle: {
          backgroundColor: '#fff', // Tab bar background color
          borderTopWidth: 0, // Remove border on top
        },
        headerShown: false, // Hide header for the tab navigator
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home-outline" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Icon name="person-outline" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Messaging" // Add Messaging tab
        component={MessagingScreen} 
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Icon name="chatbubble-outline" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="Premium" 
        component={PremiumScreen} 
        options={{
          title: 'Premium',
          tabBarIcon: ({ color, size }) => (
            <Icon name="settings-outline" color={color} size={size} />
          ),
        }} 
      />
      {/* Add more screens specific to Farmer here */}
    </Tab.Navigator>
  );
};

export default FarmerTabNavigator;
