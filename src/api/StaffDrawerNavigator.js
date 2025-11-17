// StaffDrawerNavigator.js
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
import {launchImageLibrary} from 'react-native-image-picker';

import StaffStackNavigator from './StaffStackNavigator';
import FeedStoreScreen from '../screens/FeedStoreScreen';
import StoreListScreen from '../screens/StoreListScreen';
// import VetMessagingScreen from '../screens/VetMessagingScreen';
import {fetchUserProfile} from '../utils/api';

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
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error:', response.errorMessage);
      } else {
        const uri = response.assets[0].uri;
        console.log('Selected Image URI:', uri);

        // Update state to preview immediately
        setUser(prev => ({...prev, profile_image: uri}));

        try {
          // Save to backend
          await updateProfileImage(uri);
          console.log('Profile image saved to DB');
        } catch (error) {
          console.error('Failed to save profile image:', error);
        }
      }
    });
  };

  // 👇 Fetch profile when drawer mounts
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
    // 👉 Add your logout logic here (clear tokens, navigate to login, etc.)
    console.log('Logging out...');
    props.navigation.replace('Login'); // example if you have a Login screen
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{flex: 1}}>
      {/* Profile Header */}
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

          {/* Floating edit button (over image) */}
          <TouchableOpacity
            activeOpacity={0.75}
            hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
            style={styles.editButton}
            onPress={handleSelectImage}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.profileName}>{user?.username || 'Farmer'}</Text>
            <Text style={styles.phoneNumber}>{user?.phone_number || ''}</Text>
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

const StaffDrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="MilkProduction"
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerStyle: {backgroundColor: '#333333'},
      headerTintColor: '#ffa500',
      drawerActiveTintColor: '#ffa500',
      drawerInactiveTintColor: '#333',
      drawerLabelStyle: {marginLeft: -10, fontSize: 16},
      drawerStyle: {width: 220},
    }}>
    <Drawer.Screen
      name="MilkProduction"
      component={StaffStackNavigator}
      options={{
        title: 'Production',
        drawerIcon: ({color, size}) => (
          <Ionicons name="clipboard-outline" size={size} color={color} />
        ),
      }}
    />
    {/* <Drawer.Screen
      name="FeedStore"
      component={FeedStoreScreen}
      options={{
        title: 'Accounts',
        drawerIcon: ({color, size}) => (
          <Ionicons name="person-outline" size={size} color={color} />
        ),
      }}
    /> */}

    <Drawer.Screen
      name="VetMessaging"
      component={StoreListScreen}
      options={{
        title: 'Stores',
        drawerIcon: ({color, size}) => (
          <Ionicons name="chatbubble-outline" size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);

export default StaffDrawerNavigator;

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
  editButton: {
    position: 'absolute',
    right: -4,
    bottom: 5,
    width: 25,
    height: 25,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333333ff',
    borderWidth: 2,
    borderColor: '#fff',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 2,
  },
});
