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
import ManagerDashboardScreen from '../screens/manager/ManagerDashboardScreen';
import ManagerFarmersScreen from '../screens/manager/ManagerFarmersScreen';
import ManagerMilkRecordsScreen from '../screens/manager/ManagerMilkRecordsScreen';
import ManagerPayoutsScreen from '../screens/manager/ManagerPayoutsScreen';
import ManagerCooperativeScreen from '../screens/manager/ManagerCooperativeScreen';
// import AccountScreen from '../screens/AccountScreen';

// API
import {fetchUserProfile} from '../utils/api';

const Drawer = createDrawerNavigator();

/*──────────────────────────────────────────
  CUSTOM MANAGER DRAWER CONTENT
──────────────────────────────────────────*/
const ManagerDrawerContent = props => {
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
      } catch (e) {
        console.log('Drawer profile load failed:', e);
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
            <Text style={styles.role}>Cooperative Manager</Text>
          </>
        )}
      </View>

      {/* MENU LIST (TAKES AVAILABLE SPACE) */}
      <View style={{flex: 1, backgroundColor: '#fff', paddingTop: 10}}>
        <DrawerItemList {...props} />
      </View>

      {/* LOGOUT BUTTON AT THE BOTTOM */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ffa500" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

/*──────────────────────────────────────────
  FIXED MANAGER DRAWER NAVIGATOR
──────────────────────────────────────────*/
const ManagerDrawerNavigator = () => {
  const [coopId, setCoopId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load cooperative ID from backend
  useEffect(() => {
    (async () => {
      try {
        const profile = await fetchUserProfile();
        console.log('MANAGER PROFILE:', profile);

        setCoopId(profile.cooperative_id); // Must exist in backend
      } catch (error) {
        console.log('Error loading manager profile:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // While loading ID show spinner
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
      drawerContent={props => <ManagerDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {backgroundColor: '#333'},
        headerTintColor: '#ffa500',
        drawerActiveBackgroundColor: '#ffe8cc',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {marginLeft: -10, fontSize: 16}, // Restored style
      }}>
      <Drawer.Screen
        name="Dashboard"
        component={ManagerDashboardScreen}
        initialParams={{coopId}}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="speedometer-outline" size={size} color={color} />
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
        name="Milk Records"
        component={ManagerMilkRecordsScreen}
        initialParams={{coopId}}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="water-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Payouts"
        component={ManagerPayoutsScreen}
        initialParams={{coopId}}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="cash-outline" size={size} color={color} />
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

      {/* <Drawer.Screen
        name="Account"
        component={AccountScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      /> */}
    </Drawer.Navigator>
  );
};

export default ManagerDrawerNavigator;

/*──────────────────────────────────────────
  STYLES
──────────────────────────────────────────*/
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
    marginTop: 2,
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
    marginTop: 'auto', // ⬅ pushes it to the bottom
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoutText: {
    marginLeft: 10,
    color: '#333',
    fontSize: 15,
    fontWeight: '600',
  },
});
