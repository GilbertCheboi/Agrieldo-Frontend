import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import VetRequestsOverviewScreen from '../screens/VetRequestsOverviewScreen';
import VetAccountScreen from '../screens/VetAccountScreen';
import VetBillingScreen from '../screens/VetBillingScreen';
import VetMessagingScreen from '../screens/VetMessagingScreen';
import ScheduleVisitScreen from '../screens/ScheduleVisitScreen'; // Import the ScheduleVisitScreen
import VetRequestScreen from '../screens/RequestVetScreen';
const Stack = createStackNavigator();

const VetStackNavigator = () => (
  <Stack.Navigator initialRouteName="VetHome">
    <Stack.Screen name="VetHome" component={VetRequestsOverviewScreen} />
    <Stack.Screen name="VetAccounts" component={VetAccountScreen} />
    <Stack.Screen name="VetBilling" component={VetBillingScreen} />
    <Stack.Screen name="VetMessaging" component={VetMessagingScreen} />
    <Stack.Screen name="ScheduleVisit" component={ScheduleVisitScreen} /> 

    {/* Add more vet-specific screens here */}
  </Stack.Navigator>
);

export default VetStackNavigator;
