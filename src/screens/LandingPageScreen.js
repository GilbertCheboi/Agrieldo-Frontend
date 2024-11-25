// File: src/screens/LandingPageScreen.js

import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const LandingPageScreen = ({ navigation }) => {
  useEffect(() => {
    // Navigate to the login screen after 3 seconds
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 2000); // Change the duration as needed

    return () => clearTimeout(timer); // Cleanup the timer
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo.png')} // Make sure to update this path to your logo's actual location
        style={styles.logo}
        resizeMode="contain" // Adjust the image size
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#333333',
  },
  logo: {
    width: 200, // Adjust the width as necessary
    height: 200, // Adjust the height as necessary
  },
});

export default LandingPageScreen;
