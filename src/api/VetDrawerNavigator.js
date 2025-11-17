// VetDrawerNavigator.js
import React, {useEffect, useState, useContext} from 'react';
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
import {launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';

import VetStackNavigator from './VetStackNavigator';
import VetBillingScreen from '../screens/VetBillingScreen';
import VetMessagingScreen from '../screens/VetMessagingScreen';
import DrugCategoriesScreen from '../screens/DrugCategoriesScreen';
import MarketListingsScreen from '../screens/MarketListingsScreen';

import {fetchUserProfile, updateProfileImage} from '../utils/api';
import {CartContext} from '../context/CartContext';

const CustomDrawerContent = props => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSelectImage = () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.8,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        setUser(prev => ({...prev, profile_image: uri}));

        try {
          await updateProfileImage(uri);
        } catch (error) {
          console.error('Failed to save profile image:', error);
        }
      }
    });
  };

  // Load profile
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

  const handleLogout = () => {
    props.navigation.replace('Login');
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
            activeOpacity={0.75}
            style={styles.editButton}
            onPress={handleSelectImage}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.profileName}>{user?.username || 'Vet'}</Text>
            <Text style={styles.phoneNumber}>{user?.phone_number || ''}</Text>
            <Text style={styles.profileRole}>{user?.email || ''}</Text>
          </>
        )}
      </View>

      <View style={styles.drawerList}>
        <DrawerItemList {...props} />
      </View>

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

const VetDrawerNavigator = () => {
  const {cartItems} = useContext(CartContext);
  const navigation = useNavigation();

  return (
    <Drawer.Navigator
      initialRouteName="VetRequests"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: {backgroundColor: '#333333'},
        headerTintColor: '#ffa500',
        drawerActiveTintColor: '#ffa500',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {marginLeft: -10, fontSize: 16},
        drawerStyle: {width: 220},

        // ⭐⭐⭐ CART ICON ADDED HERE
        headerRight: () => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Cart')}
            style={{marginRight: 16, position: 'relative'}}>
            <Ionicons name="cart-outline" size={26} color="#ffa500" />

            {cartItems.length > 0 && (
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -6,
                  backgroundColor: 'red',
                  borderRadius: 10,
                  width: 18,
                  height: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{color: 'white', fontSize: 10, fontWeight: 'bold'}}>
                  {cartItems.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ),
      }}>
      <Drawer.Screen
        name="VetRequests"
        component={VetStackNavigator}
        options={{
          title: 'My Farms',
          drawerIcon: ({color, size}) => (
            <Ionicons name="clipboard-outline" size={size} color={color} />
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
          title: 'Requests',
          drawerIcon: ({color, size}) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
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
        name="Market"
        component={MarketListingsScreen}
        options={{
          title: 'Market/Auction',
          drawerIcon: ({color, size}) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default VetDrawerNavigator;

// Styles
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
    borderColor: '#fff',
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

  profileName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },

  phoneNumber: {
    color: '#fff',
    fontSize: 13,
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
