// EducationScreen.js
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

const EducationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Education</Text>
      <Text>Welcome to the education page.</Text>
      <Button title="View Materials" onPress={() => {/* Add functionality to view educational materials */}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default EducationScreen;
