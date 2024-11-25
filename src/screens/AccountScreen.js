import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, ScrollView, TouchableOpacity   } from 'react-native';
import axios from 'axios';

const AccountScreen = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Camera 1 */}
      <View style={styles.cameraContainer}>
        <Text style={styles.cameraTitle}>Camera 1 - Front Gate</Text>
        <View style={styles.videoContainer}>
          <Image 
        source={require('../assets/vinny.png')} // Path to your image
        style={styles.videoFeed} 
          />
          <Text style={styles.videoText}>Live Feed - Front Gate</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>Camera Status: Active</Text>
          <Text style={styles.detailsText}>Last Update: 2 minutes ago</Text>
        </View>
        <TouchableOpacity 
          style={[styles.button, styles.refreshButton]} 
          onPress={() => alert('Refreshing Camera 1 Feed')}>
          <Text style={styles.buttonText}>Refresh Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.settingsButton]} 
          onPress={() => alert('Opening Camera 1 Settings')}>
          <Text style={styles.buttonText}>View Camera Settings</Text>
        </TouchableOpacity>
      </View>

      {/* Camera 2 */}
      <View style={styles.cameraContainer}>
        <Text style={styles.cameraTitle}>Camera 2 - Livestock Area</Text>
        <View style={styles.videoContainer}>
          <Image 
        source={require('../assets/vinny.png')} // Path to your image
        style={styles.videoFeed} 
          />
          <Text style={styles.videoText}>Live Feed - Livestock Area</Text>
        </View>
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsText}>Camera Status: Active</Text>
          <Text style={styles.detailsText}>Last Update: 3 minutes ago</Text>
        </View>
        <TouchableOpacity 
          style={[styles.button, styles.refreshButton]} 
          onPress={() => alert('Refreshing Camera 2 Feed')}>
          <Text style={styles.buttonText}>Refresh Feed</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.settingsButton]} 
          onPress={() => alert('Opening Camera 2 Settings')}>
          <Text style={styles.buttonText}>View Camera Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  cameraContainer: {
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  cameraTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  videoContainer: {
    alignItems: 'center',
    marginBottom: 20,
    flexDirection: 'column',
  },
  videoFeed: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    backgroundColor: '#d3d3d3',
  },
  videoText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  detailsContainer: {
    marginBottom: 20,
    marginLeft: 10,
  },
  detailsText: {
    fontSize: 16,
    marginVertical: 5,
    color: '#555',
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginVertical: 10,
  },
  refreshButton: {
    backgroundColor: '#ffa500', // Orange color for the refresh button
  },
  settingsButton: {
    backgroundColor: '#ffa500', // Orange color for the settings button
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
export default AccountScreen;
