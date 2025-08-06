// File: src/api/FarmerStackNavigator.js

import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AccountScreen from '../screens/AccountScreen';
import BillingScreen from '../screens/BillingScreen';
import MessagingScreen from '../screens/MessagingScreen';
import MarketScreen from '../screens/MarketScreen';
import StoreScreen from '../screens/StoreScreen';
import ChatGPT from '../screens/ChatGPT'; // Adjust the path as necessary
import VetRequestScreen from '../screens/RequestVetScreen';
import FarmerTabNavigator from './FarmerTabNavigator'; // Import the TabNavigator
import MilkRecordsScreen from '../screens/MilkRecordsScreen';
import MilkDetailScreen from '../screens/MilkDetailScreen';
import FinancialOverviewScreen from '../screens/FinancialOverviewScreen';
import FinancialDetailsScreen from '../screens/FinancialDetailsScreen';
import AddExpense from '../screens/AddExpense';
import AddIncome from '../screens/AddIncome';
import AllAnimalsScreen from '../screens/AllAnimalsScreen';
import AddPostScreen from '../screens/AddPostScreen';
import AnimalDetailsScreen from '../screens/AnimalDetailsScreen';

const Stack = createStackNavigator();

const FarmerStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="FarmerTabNavigator" // Set the initial route to TabNavigator
    screenOptions={{
      headerShown: true,
      headerStyle: {backgroundColor: '#f5f5f5'},
      headerTintColor: '#000',
      headerTitleStyle: {fontWeight: 'bold'},
      cardStyle: {backgroundColor: '#fff'}, // Set background color for all stack screens
    }}>
    {/* FarmerTabNavigator is the initial screen */}
    <Stack.Screen
      name="FarmerTabNavigator"
      component={FarmerTabNavigator} // TabNavigator will be shown here
      options={{headerShown: false}} // Hide the header when inside tab navigator
    />

    {/* Other screens in the stack that will be pushed on top of the TabNavigator */}
    <Stack.Screen
      name="Accounts"
      component={AccountScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="Billing"
      component={BillingScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="Messaging"
      component={MessagingScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="Market"
      component={MarketScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="Store"
      component={StoreScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="Education"
      component={ChatGPT}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="RequestVet"
      component={VetRequestScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="MilkRecords"
      component={MilkRecordsScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="MilkDetail"
      component={MilkDetailScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="FinancialOverview"
      component={FinancialOverviewScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="FinancialDetails"
      component={FinancialDetailsScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="AddExpense"
      component={AddExpense}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="AddIncome"
      component={AddIncome}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="AllAnimals"
      component={AllAnimalsScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="AddPost"
      component={AddPostScreen}
      options={{headerShown: true}}
    />
    <Stack.Screen
      name="AnimalDetails"
      component={AnimalDetailsScreen}
      options={{headerShown: true}}
    />

    <Stack.Screen
      name="FarmDashboard"
      component={FarmDashboard}
      options={{headerShown: true}}
    />
  </Stack.Navigator>
);

export default FarmerStackNavigator;
