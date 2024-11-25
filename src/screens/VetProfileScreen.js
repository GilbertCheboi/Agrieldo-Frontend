// File: src/screens/VetProfileScreen.js

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const VetProfileScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vet Profile Screen</Text>
      <Text>Name: Dr. Jane Doe</Text>
      <Text>Email: jane.doe@example.com</Text>
      <Text>Phone: +123456789</Text>
      <Button title="Edit Profile" onPress={() => alert('Edit Profile')} />
      <Button title="Back to Home" onPress={() => navigation.navigate('VetHome')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default VetProfileScreen;
