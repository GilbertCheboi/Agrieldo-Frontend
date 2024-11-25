// File: src/screens/HomeScreen.js

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Button } from 'react-native';
import DashboardScreen from './DashboardScreen';

const HomeScreen = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      {/* <View style={styles.content}> */}
        <DashboardScreen/>
        {/* <Text style={styles.title}>Welcome to Farm Management App</Text>
        <Text style={styles.subtitle}>About the Project</Text>
        <Text style={styles.text}>
          The Farm Management App is designed to help farmers manage their farms efficiently. 
          This app includes features such as real-time surveillance, record keeping, and more.
        </Text>
        <Text style={styles.subtitle}>Features</Text>
        <Text style={styles.text}>
          - Real-time Surveillance{'\n'}
          - Record Keeping{'\n'}
          - Farmer and Vet Accounts{'\n'}
          - Billing System{'\n'}
          - In-App Messaging{'\n'}
          - Market/Auction{'\n'}
          - Drug Store{'\n'}
          - Educational Materials{'\n'}
          - Contract Farming{'\n'}
          - Farm Agency{'\n'}
        </Text>
        <Text style={styles.subtitle}>Get Started</Text>
        <Text style={styles.text}>
          To get started, explore the app and make use of the various features to streamline your farm management tasks.
        </Text>
        {/* Button to navigate to LoginScreen */}
        {/* <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Login')}
          />
        </View> */}
      {/* </View> */} 
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default HomeScreen;
