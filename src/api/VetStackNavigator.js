// VetStackNavigator.js
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
//import VetRequestScreen from '../screens/RequestVetScreen';
import ScheduleVisitScreen from '../screens/ScheduleVisitScreen';
import VetFarmsScreen from '../screens/VetFarmsScreen';

const Stack = createStackNavigator();

const VetStackNavigator = () => (
  <Stack.Navigator
    initialRouteName="VetHome"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="VetHome" component={VetFarmsScreen} />
    <Stack.Screen name="ScheduleVisit" component={ScheduleVisitScreen} />
    {/* add more request-related screens here */}
  </Stack.Navigator>
);

export default VetStackNavigator;
