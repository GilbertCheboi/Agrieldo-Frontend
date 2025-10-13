// VetDrawerNavigator.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Ionicons from 'react-native-vector-icons/Ionicons';

import VetStackNavigator from './VetStackNavigator';
import VetAccountScreen from '../screens/VetAccountScreen';
import VetBillingScreen from '../screens/VetBillingScreen';
import VetMessagingScreen from '../screens/VetMessagingScreen';
import {fetchUserProfile} from '../utils/api';

const CustomDrawerContent = props => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await fetchUserProfile();
        setUser(data);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    // 👉 Add your logout logic here (clear tokens, navigate to login, etc.)
    console.log('Logging out...');
    props.navigation.replace('Login'); // example if you have a Login screen
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Image
          source={require('../assets/vet-profile-img.jpeg')}
          style={styles.profileImage}
        />
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.profileName}>
              {user?.username ? `Dr. ${user.username}` : 'Unknown Vet'}
            </Text>
            <Text style={styles.profileRole}>{user?.email || ''}</Text>
          </>
        )}
      </View>

      {/* Drawer items */}
      <View style={styles.drawerList}>
        <DrawerItemList {...props} />
      </View>

      {/* Logout button pinned at bottom */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#333" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const Drawer = createDrawerNavigator();

const VetDrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="VetRequests"
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerStyle: {backgroundColor: '#ffa500'},
      headerTintColor: '#fff',
      drawerActiveTintColor: '#ffa500',
      drawerInactiveTintColor: '#333',
      drawerLabelStyle: {marginLeft: -10, fontSize: 16},
      drawerStyle: {width: 220},
    }}>
    <Drawer.Screen
      name="VetRequests"
      component={VetStackNavigator}
      options={{
        title: 'Requests',
        drawerIcon: ({color, size}) => (
          <Ionicons name="clipboard-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="VetAccounts"
      component={VetAccountScreen}
      options={{
        title: 'Accounts',
        drawerIcon: ({color, size}) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="VetBilling"
      component={VetBillingScreen}
      options={{
        title: 'Billing',
        drawerIcon: ({color, size}) => (
          <Ionicons name="cash-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="VetMessaging"
      component={VetMessagingScreen}
      options={{
        title: 'Messaging',
        drawerIcon: ({color, size}) => (
          <Ionicons name="chatbubble-outline" size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);

export default VetDrawerNavigator;

// Styles
const styles = StyleSheet.create({
  header: {
    paddingVertical: 15,
    backgroundColor: '#ffa500',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileRole: {
    color: '#fff',
    fontSize: 13,
  },
  drawerList: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
  },
  logoutContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
});
