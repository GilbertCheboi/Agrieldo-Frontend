import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Screens
import ClerkMilkEntryScreen from '../screens/clerk/ClerkMilkEntryScreen';
import ManagerFarmersScreen from '../screens/manager/ManagerFarmersScreen';
import ManagerMilkRecordsScreen from '../screens/manager/ManagerMilkRecordsScreen';
import ManagerCooperativeScreen from '../screens/manager/ManagerCooperativeScreen';

// API
import {fetchUserProfile} from '../utils/api';

const Drawer = createDrawerNavigator();

/*───────────────────────────────────────────────
  CUSTOM CLERK DRAWER CONTENT WITH LOGOUT AT BOTTOM
────────────────────────────────────────────────*/
const ClerkDrawerContent = props => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    username: '',
    email: '',
    profile_image: null,
  });

  useEffect(() => {
    (async () => {
      try {
        const profile = await fetchUserProfile();
        setUser(profile);
      } catch (error) {
        console.log('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      'access_token',
      'refresh_token',
      'user_type',
    ]);

    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{name: 'Login'}],
      }),
    );
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      {/* HEADER */}
      <View style={styles.header}>
        <Image
          source={
            user.profile_image
              ? {uri: user.profile_image}
              : require('../assets/farmer.jpeg')
          }
          style={styles.profileImage}
        />

        {loading ? (
          <ActivityIndicator color="#ffa500" />
        ) : (
          <>
            <Text style={styles.profileName}>{user.username}</Text>
            <Text style={styles.profileEmail}>{user.email}</Text>
            <Text style={styles.role}>Clerk</Text>
          </>
        )}
      </View>

      {/* MENU LIST */}
      <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
        <DrawerItemList {...props} />
      </View>

      {/* LOGOUT BUTTON AT BOTTOM */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ffa500" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

/*───────────────────────────────────────────────
  CLERK DRAWER NAVIGATOR
────────────────────────────────────────────────*/
const ClerkDrawerNavigator = () => {
  const [coopId, setCoopId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Clerk Cooperative ID from backend
  useEffect(() => {
    (async () => {
      try {
        const profile = await fetchUserProfile();
        setCoopId(profile.cooperative_id);
      } catch (error) {
        console.log('Error fetching clerk profile:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading || !coopId) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#ffa500" />
        <Text style={{marginTop: 10}}>Loading Cooperative...</Text>
      </View>
    );
  }

  return (
    <Drawer.Navigator
      drawerContent={props => <ClerkDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {backgroundColor: '#333'},
        headerTintColor: '#ffa500',
        drawerActiveBackgroundColor: '#ffe8cc',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {marginLeft: -10, fontSize: 16},
      }}>
      <Drawer.Screen
        name="Milk Entry"
        component={ClerkMilkEntryScreen}
        initialParams={{coopId}}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="water-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Farmers"
        component={ManagerFarmersScreen}
        initialParams={{coopId}}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Today's Records"
        component={ManagerMilkRecordsScreen}
        initialParams={{coopId}}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="My Cooperative"
        component={ManagerCooperativeScreen}
        initialParams={{coopId}}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="business-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default ClerkDrawerNavigator;

/*───────────────────────────────────────────────
  STYLES
────────────────────────────────────────────────*/
const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#333',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: '#ffa500',
    marginBottom: 10,
  },
  profileName: {
    color: '#ffa500',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileEmail: {
    color: '#fff',
    fontSize: 13,
  },
  role: {
    color: '#ffa500',
    fontSize: 13,
    marginTop: 5,
  },

  logoutContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
    marginTop: 'auto',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
});
