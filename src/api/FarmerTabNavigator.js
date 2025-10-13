// File: src/navigation/FarmerTabNavigator.js

import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PremiumScreen from '../screens/PremiumScreen';
import MessagingScreen from '../screens/MessagingScreen'; // Import the Messaging screen
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createBottomTabNavigator();

// const FarmerTabNavigator = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={{
//         tabBarActiveTintColor: '#ffa500', // Active tab color
//         tabBarInactiveTintColor: '#333333', // Inactive tab color
//         tabBarStyle: {
//           backgroundColor: '#fff', // Tab bar background color
//           borderTopWidth: 0, // Remove border on top
//         },
//         headerShown: false, // Hide header for the tab navigator
//       }}>
//       <Tab.Screen
//         name="Home"
//         component={HomeScreen}
//         options={{
//           title: 'Home',
//           tabBarIcon: ({color, size}) => (
//             <Ionicons name="home-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="Profile"
//         component={ProfileScreen}
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({color, size}) => (
//             <Ionicons name="person-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="Messaging"
//         component={MessagingScreen}
//         options={{
//           title: 'Messages',
//           tabBarIcon: ({color, size}) => (
//             <Ionicons name="chatbubble-outline" size={size} color={color} />
//           ),
//         }}
//       />

//       <Tab.Screen
//         name="Premium"
//         component={PremiumScreen}
//         options={{
//           title: 'Premium',
//           tabBarIcon: ({color, size}) => (
//             <Feather name="settings" size={size} color={color} />
//           ),
//         }}
//       />

//       {/* Add more screens specific to Farmer here */}
//     </Tab.Navigator>
//   );
// };

const FarmerTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="Messaging" // 👈 Default tab will now be Messaging
      screenOptions={{
        tabBarActiveTintColor: '#ffa500',
        tabBarInactiveTintColor: '#333333',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
        },
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profile',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Messaging"
        component={MessagingScreen}
        options={{
          title: 'Messages',
          tabBarIcon: ({color, size}) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Premium"
        component={PremiumScreen}
        options={{
          title: 'Premium',
          tabBarIcon: ({color, size}) => (
            <Feather name="settings" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default FarmerTabNavigator;
