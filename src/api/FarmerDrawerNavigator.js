// File: src/navigation/DrawerNavigator.js

import React from 'react';
import {createDrawerNavigator, DrawerItem} from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions, useNavigation} from '@react-navigation/native';

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FarmerTabNavigator from './FarmerTabNavigator'; // Import your FarmerTabNavigator
import AccountScreen from '../screens/AccountScreen';
import BillingScreen from '../screens/BillingScreen';
import MarketScreen from '../screens/MarketScreen';
import StoreScreen from '../screens/StoreScreen';
import ChatGPT from '../screens/ChatGPT';
import VetRequestListScreen from '../screens/VetRequestsListScreen';
import AllAnimalsScreen from '../screens/AllAnimalsScreen';
import {createStackNavigator} from '@react-navigation/stack';
import AnimalDetailsScreen from '../screens/AnimalDetailsScreen';
import MilkDetailScreen from '../screens/MilkDetailScreen';
import FarmDashboard from '../screens/FarmDashboard'; // ✅ Import this

// Create a Stack Navigator for "My Farm" section
const Stack = createStackNavigator();

// This Stack Navigator will always include FarmerTabNavigator
const FarmerStackNavigator = () => (
  <Stack.Navigator>
    {/* FarmerTabNavigator is the first screen in the stack */}
    <Stack.Screen
      name="Home"
      component={FarmerTabNavigator}
      options={{headerShown: false}}
    />
    <Stack.Screen name="My Farm" component={AccountScreen} />
    <Stack.Screen name="Billing" component={BillingScreen} />
    <Stack.Screen name="Feed Store" component={AllAnimalsScreen} />
    <Stack.Screen name="Market" component={MarketScreen} />
    <Stack.Screen name="Store" component={StoreScreen} />
    <Stack.Screen name="Education" component={ChatGPT} />
    <Stack.Screen name="VetRequests" component={VetRequestListScreen} />
    <Stack.Screen
      name="AnimalDetails"
      component={AnimalDetailsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MilkDetail"
      component={MilkDetailScreen}
      options={{headerShown: false}}
    />
    {/* ✅ Add this line to fix the issue */}
    <Stack.Screen
      name="FarmDashboard"
      component={FarmDashboard}
      options={{title: 'Farm Dashboard'}}
    />
  </Stack.Navigator>
);

const Drawer = createDrawerNavigator();

const CustomDrawerContent = props => {
  const navigation = props.navigation;

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');

      // Redirect to Home (or Login if you prefer)
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}], // Change to 'Login' if you have a Login screen
        }),
      );
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.drawerContent}>
      {/* Agrieldo Section */}
      <View style={styles.section}>
        <DrawerItem
          label="Agrieldo"
          onPress={() => navigation.navigate('Home')}
          style={[styles.drawerItem, styles.agrieldoItem]}
        />
      </View>

      {/* Main Navigation Section */}
      <View style={styles.section}>
        <DrawerItem
          label="My Farm"
          onPress={() => navigation.navigate('My Farm')}
          style={styles.drawerItem}
        />
        <DrawerItem
          label="Billing and Invoices"
          onPress={() => navigation.navigate('Billing')}
          style={styles.drawerItem}
        />
        <DrawerItem
          label="Feed Store"
          onPress={() => navigation.navigate('Feed Store')}
          style={styles.drawerItem}
        />
        <DrawerItem
          label="Market/Auction"
          onPress={() => navigation.navigate('Market')}
          style={styles.drawerItem}
        />
        <DrawerItem
          label="Drug Store"
          onPress={() => navigation.navigate('Store')}
          style={styles.drawerItem}
        />
        <DrawerItem
          label="Agrieldo (AI)"
          onPress={() => navigation.navigate('Education')}
          style={styles.drawerItem}
        />
        <DrawerItem
          label="My Vet Requests"
          onPress={() => navigation.navigate('VetRequests')}
          style={styles.drawerItem}
        />
      </View>

      {/* Logout Section */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const FarmerDrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: true,
      drawerStyle: {
        backgroundColor: '#f7f7f7',
        width: 240,
      },
      drawerLabelStyle: {
        color: '#333333',
        fontWeight: 'bold',
        fontSize: 14, // Adjusted font size for readability
      },
      drawerItemStyle: {
        marginVertical: 5,
        backgroundColor: '#fff',
        borderRadius: 10,
      },
    }}
    drawerContent={props => <CustomDrawerContent {...props} />}>
    {/* Home Screen now goes to FarmerStackNavigator */}
    <Drawer.Screen
      name="Home"
      component={FarmerStackNavigator}
      options={{
        title: 'Agrieldo',
        drawerLabelStyle: {
          fontSize: 16, // Slightly smaller font size for label
        },
        drawerItemStyle: {
          backgroundColor: '#ffa500', // Highlight color for Home in the drawer
          borderRadius: 10,
        },
      }}
    />

    {/* Other screens in the Drawer */}
    <Drawer.Screen
      name="My Farm"
      component={AccountScreen}
      options={{title: 'My Farm'}}
    />
    <Drawer.Screen
      name="Billing"
      component={BillingScreen}
      options={{title: 'Billing and Invoices'}}
    />
    <Drawer.Screen
      name="Feed Store"
      component={AllAnimalsScreen}
      options={{title: 'Feed Store'}}
    />
    <Drawer.Screen
      name="Market"
      component={MarketScreen}
      options={{title: 'Market/Auction'}}
    />
    <Drawer.Screen
      name="Store"
      component={StoreScreen}
      options={{title: 'Drug Store'}}
    />
    <Drawer.Screen
      name="Education"
      component={ChatGPT}
      options={{title: 'Agrieldo (AI)'}}
    />
    <Drawer.Screen
      name="VetRequests"
      component={VetRequestListScreen}
      options={{title: 'My Vet Requests'}}
    />
  </Drawer.Navigator>
);

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
    paddingTop: 20,
  },
  section: {
    marginBottom: 20,
  },
  drawerItem: {
    backgroundColor: '#e0e0e0', // Light gray background for items
    paddingVertical: 8, // Reduced padding to make items smaller
    paddingHorizontal: 12,
    borderRadius: 8, // Smaller border radius for smoother corners
    marginBottom: 8,
    marginHorizontal: 8,
  },
  agrieldoItem: {
    backgroundColor: '#ffa500', // Highlight Agrieldo item
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 16,
  },
  logoutButton: {
    backgroundColor: '#ff5733',
    paddingVertical: 10,
    borderRadius: 8, // Rounded corners for logout button
    alignItems: 'center',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16, // Smaller font size
    fontWeight: 'bold',
  },
});

export default FarmerDrawerNavigator;
