// File: src/screens/VetSettingsScreen.js

import React from 'react';
import { View, Text, StyleSheet, Button, Switch } from 'react-native';

const VetSettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);

  const toggleSwitch = () => setNotificationsEnabled(previousState => !previousState);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vet Settings Screen</Text>
      <View style={styles.settingItem}>
        <Text>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleSwitch}
        />
      </View>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
});

export default VetSettingsScreen;
