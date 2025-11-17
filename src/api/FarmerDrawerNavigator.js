import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {CommonActions} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack';

// Cart
import {CartContext} from '../context/CartContext';
import CartScreen from '../screens/CartScreen';

// Screens
import FarmerTabNavigator from './FarmerTabNavigator';
import AccountScreen from '../screens/AccountScreen';
import BillingScreen from '../screens/BillingScreen';
import MarketScreen from '../screens/MarketScreen';
import StoreScreen from '../screens/StoreScreen';
import VetRequestListScreen from '../screens/VetRequestsListScreen';
import FarmDashboard from '../screens/FarmDashboard';
import VetRequestPermissionScreen from '../screens/VetRequestPermissionScreen';
import FeedStoreScreen from '../screens/FeedStoreScreen';
import StoreListScreen from '../screens/StoreListScreen';
import VetRequestsOverviewScreen from '../screens/VetRequestsOverviewScreen';
import {fetchUserProfile, updateProfileImage} from '../utils/api';
import ProductionHistoryScreen from '../screens/ProductionHistoryScreen';
import FeedStore from '../screens/FeedStore';
import FeedCategoriesScreen from '../screens/FeedCategoriesScreen';
import DrugCategoriesScreen from '../screens/DrugCategoriesScreen';
import MarketListingsScreen from '../screens/MarketListingsScreen';

const Stack = createStackNavigator();

/*───────────────────────────────────────────────
  FARMER STACK WITH CART ICON ON HEADER
────────────────────────────────────────────────*/
const FarmerStackNavigator = () => {
  const {cartItems} = useContext(CartContext);

  return (
    <Stack.Navigator
      screenOptions={({navigation}) => ({
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={{marginRight: 15}}>
            <View>
              <Ionicons name="cart-outline" size={26} color="#ffa500" />

              {cartItems.length > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -4,
                    backgroundColor: 'red',
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 10, fontWeight: 'bold'}}>
                    {cartItems.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ),
      })}>
      <Stack.Screen
        name="FarmerHome"
        component={FarmerTabNavigator}
        options={{headerShown: false}}
      />

      <Stack.Screen name="My Farm" component={AccountScreen} />
      <Stack.Screen name="Billing" component={BillingScreen} />
      <Stack.Screen name="Feed Store" component={FeedStoreScreen} />
      <Stack.Screen name="Market" component={MarketScreen} />
      <Stack.Screen name="Store" component={StoreListScreen} />

      <Stack.Screen
        name="VetRequestsOverview"
        component={VetRequestsOverviewScreen}
      />

      <Stack.Screen
        name="FarmDashboard"
        component={FarmDashboard}
        options={{title: 'Farm Dashboard'}}
      />

      {/* CART SCREEN */}
      <Stack.Screen
        name="Cart"
        component={CartScreen}
        options={{title: 'My Cart'}}
      />
    </Stack.Navigator>
  );
};

/*───────────────────────────────────────────────
  CUSTOM DRAWER
────────────────────────────────────────────────*/
const Drawer = createDrawerNavigator();

const CustomDrawerContent = props => {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: 'Farmer',
    email: 'farmer@app.com',
  });

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.8,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel || response.errorCode) return;

      const uri = response.assets[0].uri;

      setUser(prev => ({...prev, profile_image: uri}));

      try {
        await updateProfileImage(uri);
      } catch (error) {
        console.error('Failed to save profile image:', error);
      }
    });
  };

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await fetchUserProfile();
        setUser({
          username: profile.username,
          email: profile.email,
          profile_image: profile.profile_image,
          phone_number: profile.phone_number,
        });
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');

      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: 'Login'}],
        }),
      );
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      <View style={styles.header}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={
              user?.profile_image
                ? {uri: user.profile_image}
                : require('../assets/farmer.jpeg')
            }
            style={styles.profileImage}
          />

          <TouchableOpacity
            style={styles.editButton}
            onPress={handleSelectImage}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.profileName}>{user?.username}</Text>
            <Text style={styles.phoneNumber}>{user?.phone_number}</Text>
            <Text style={styles.profileRole}>{user?.email}</Text>
          </>
        )}
      </View>

      <View style={styles.drawerList}>
        <DrawerItemList {...props} />
      </View>

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
  DRAWER NAVIGATOR (with Cart icon inherited)
────────────────────────────────────────────────*/
const FarmerDrawerNavigator = () => {
  const {cartItems} = useContext(CartContext);

  return (
    <Drawer.Navigator
      initialRouteName="FarmerHome"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={({navigation}) => ({
        headerStyle: {backgroundColor: '#333333'},
        headerTintColor: '#ffa500',
        drawerActiveBackgroundColor: '#ffe8cc',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {marginLeft: -10, fontSize: 16},
        drawerStyle: {width: 240},

        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={{marginRight: 15}}>
            <View>
              <Ionicons name="cart-outline" size={26} color="#ffa500" />

              {cartItems.length > 0 && (
                <View
                  style={{
                    position: 'absolute',
                    right: -6,
                    top: -4,
                    backgroundColor: 'red',
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{color: '#fff', fontSize: 10, fontWeight: 'bold'}}>
                    {cartItems.length}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ),
      })}>
      <Drawer.Screen
        name="Farmer Home"
        component={FarmerStackNavigator}
        options={{
          title: 'Agrieldo',
          drawerIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="My Farm"
        component={AccountScreen}
        options={{
          drawerIcon: ({color, size}) => (
            <Ionicons name="leaf-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Billing"
        component={BillingScreen}
        options={{
          title: 'Billing & Invoices',
          drawerIcon: ({color, size}) => (
            <Ionicons name="cash-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Feed Store"
        component={StoreListScreen}
        options={{
          title: 'My Store',
          drawerIcon: ({color, size}) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Market"
        component={MarketListingsScreen}
        options={{
          title: 'Market/Auction',
          drawerIcon: ({color, size}) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="Store"
        component={DrugCategoriesScreen}
        options={{
          title: 'Drug Store',
          drawerIcon: ({color, size}) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="FeedStores"
        component={FeedCategoriesScreen}
        options={{
          title: 'Feed Store',
          drawerIcon: ({color, size}) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="VetPermission"
        component={VetRequestPermissionScreen}
        options={{
          title: 'Request Vet',
          drawerIcon: ({color, size}) => (
            <Ionicons name="medical-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default FarmerDrawerNavigator;

/*───────────────────────────────────────────────
  STYLES
────────────────────────────────────────────────*/
const styles = StyleSheet.create({
  header: {
    paddingVertical: 15,
    backgroundColor: '#333333',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#ffa500',
  },
  profileName: {
    color: '#ffa500',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileRole: {
    color: '#ffa500',
    fontSize: 13,
  },
  phoneNumber: {
    color: '#ffa500',
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
    color: '#333',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
  },
  profileImageWrapper: {
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    right: -4,
    bottom: 5,
    width: 25,
    height: 25,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333',
    borderWidth: 2,
    borderColor: '#fff',
  },
});
