import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import VetStackNavigator from './VetStackNavigator'; // Import VetStackNavigator
import VetAccountScreen from '../screens/VetAccountScreen';
import VetBillingScreen from '../screens/VetBillingScreen';
import VetMessagingScreen from '../screens/VetMessagingScreen';
import VetRequestsOverviewScreen from '../screens/VetRequestsOverviewScreen';


const Drawer = createDrawerNavigator();

const VetDrawerNavigator = () => (
  <Drawer.Navigator initialRouteName="VetStack">
    <Drawer.Screen name="VetStack" component={VetStackNavigator} />
    <Drawer.Screen name="VetHome" component={VetRequestsOverviewScreen} />
    <Drawer.Screen name="VetAccounts" component={VetAccountScreen} />
    <Drawer.Screen name="VetBilling" component={VetBillingScreen} />
    <Drawer.Screen name="VetMessaging" component={VetMessagingScreen} />
    {/* Add more vet-specific screens here */}
    {/* You can add more screens if necessary */}
  </Drawer.Navigator>
);

export default VetDrawerNavigator;
