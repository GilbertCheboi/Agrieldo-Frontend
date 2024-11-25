// src/api/DrawerNavigator.js
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AccountScreen from '../screens/AccountScreen';
import BillingScreen from '../screens/BillingScreen';
import MessagingScreen from '../screens/MessagingScreen';
import MarketScreen from '../screens/MarketScreen';
import StoreScreen from '../screens/StoreScreen';
import EducationScreen from '../screens/EducationScreen';
import TabNavigator from './TabNavigator'; // Import TabNavigator to integrate bottom tabs

// You can also import custom drawer content if needed
// import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: true,  // Show or hide the header
      drawerStyle: {
        backgroundColor: '#f5f5f5',  // Customize the drawer background
        width: 240,
      },
      // Optional: Customize item label or use icons here
      // drawerLabelStyle: { fontSize: 18 },
    }}
    // You can add a custom drawer content component like this:
    // drawerContent={(props) => <CustomDrawerContent {...props} />}
  >
    {/* Integrate bottom tab navigation */}
    <Drawer.Screen 
      name="Home" 
      component={TabNavigator} // Use TabNavigator for Home
      options={{ title: 'Dashboard' }} 
    />
    <Drawer.Screen name="Accounts" component={AccountScreen} options={{ title: 'Manage Accounts' }} />
    <Drawer.Screen name="Billing" component={BillingScreen} options={{ title: 'Billing and Invoices' }} />
    <Drawer.Screen name="Messaging" component={MessagingScreen} options={{ title: 'In-App Messaging' }} />
    <Drawer.Screen name="Market" component={MarketScreen} options={{ title: 'Market/Auction' }} />
    <Drawer.Screen name="Store" component={StoreScreen} options={{ title: 'Drug Store' }} />
    <Drawer.Screen name="Education" component={EducationScreen} options={{ title: 'Educational Resources' }} />
  </Drawer.Navigator>
);

export default DrawerNavigator;
