// VetStackNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
//import VetRequestScreen from '../screens/RequestVetScreen';
import ScheduleVisitScreen from '../screens/ScheduleVisitScreen';
import ProductionHistoryScreen from '../screens/ProductionHistoryScreen';

const Stack = createStackNavigator();

const StaffStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="StaffHome"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="StaffHome" component={ProductionHistoryScreen} />
    <Stack.Screen name="ScheduleVisit" component={ScheduleVisitScreen} />
    {/* add more request-related screens here */}
  </Stack.Navigator>
);

export default StaffStackNavigator;
