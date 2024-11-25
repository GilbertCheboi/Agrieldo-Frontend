// src/screens/VetHomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const VetHomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Welcome to the Vet Home!</Text>
      <Button title="Go to Billing" onPress={() => navigation.navigate('VetBilling')} />
    </View>
  );
};

export default VetHomeScreen;
