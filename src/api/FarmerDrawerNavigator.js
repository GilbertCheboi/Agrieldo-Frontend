// // File: src/navigation/DrawerNavigator.js

// import React from 'react';
// import {createDrawerNavigator, DrawerItem} from '@react-navigation/drawer';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {CommonActions, useNavigation} from '@react-navigation/native';

// import {
//   View,
//   Text,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
// } from 'react-native';
// import FarmerTabNavigator from './FarmerTabNavigator'; // Import your FarmerTabNavigator
// import AccountScreen from '../screens/AccountScreen';
// import BillingScreen from '../screens/BillingScreen';
// import MarketScreen from '../screens/MarketScreen';
// import StoreScreen from '../screens/StoreScreen';
// import ChatGPT from '../screens/ChatGPT';
// import VetRequestListScreen from '../screens/VetRequestsListScreen';
// // import AllAnimalsScreen from '../screens/AllAnimalsScreen';
// import {createStackNavigator} from '@react-navigation/stack';
// import AnimalDetailsScreen from '../screens/AnimalDetailsScreen';
// import MilkDetailScreen from '../screens/MilkDetailScreen';
// import FarmDashboard from '../screens/FarmDashboard'; // ✅ Import this
// // import DashboardScreen from '../screens/VetRequestsOverviewScreen';
// import VetRequestPermissionScreen from '../screens/VetRequestPermissionScreen';
// import FeedStoreScreen from '../screens/FeedStoreScreen';
// import VetRequestsOverviewScreen from '../screens/VetRequestsOverviewScreen';

// // Create a Stack Navigator for "My Farm" section
// const Stack = createStackNavigator();

// // This Stack Navigator will always include FarmerTabNavigator
// const FarmerStackNavigator = () => (
//   <Stack.Navigator>
//     {/* FarmerTabNavigator is the first screen in the stack */}
//     <Stack.Screen
//       name="FarmerHome"
//       component={FarmerTabNavigator}
//       options={{headerShown: false}}
//     />
//     <Stack.Screen name="My Farm" component={AccountScreen} />
//     <Stack.Screen name="Billing" component={BillingScreen} />
//     <Stack.Screen name="Feed Store" component={FeedStoreScreen} />
//     <Stack.Screen name="Market" component={MarketScreen} />
//     <Stack.Screen name="Store" component={StoreScreen} />
//     <Stack.Screen name="Education" component={ChatGPT} />
//     <Stack.Screen
//       name="VetRequestsOverview"
//       component={VetRequestsOverviewScreen}
//     />
//     <Stack.Screen
//       name="AnimalDetails"
//       component={AnimalDetailsScreen}
//       options={{headerShown: false}}
//     />
//     <Stack.Screen
//       name="MilkDetail"
//       component={MilkDetailScreen}
//       options={{headerShown: false}}
//     />
//     {/* ✅ Add this line to fix the issue */}
//     <Stack.Screen
//       name="FarmDashboard"
//       component={FarmDashboard}
//       options={{title: 'Farm Dashboard'}}
//     />
//   </Stack.Navigator>
// );

// const Drawer = createDrawerNavigator();

// const CustomDrawerContent = props => {
//   const navigation = props.navigation;

//   const handleLogout = async () => {
//     try {
//       await AsyncStorage.removeItem('access_token');
//       await AsyncStorage.removeItem('refresh_token');

//       // Redirect to Home (or Login if you prefer)
//       navigation.dispatch(
//         CommonActions.reset({
//           index: 0,
//           routes: [{name: 'Login'}], // Change to 'Login' if you have a Login screen
//         }),
//       );
//     } catch (error) {
//       console.error('Logout Error:', error);
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.drawerContent}>
//       {/* Agrieldo Section */}
//       <View style={styles.section}>
//         <DrawerItem
//           label="Agrieldo"
//           onPress={() => navigation.navigate('FarmerHome')}
//           style={[styles.drawerItem, styles.agrieldoItem]}
//         />
//       </View>

//       {/* Main Navigation Section */}
//       <View style={styles.section}>
//         <DrawerItem
//           label="My Farms"
//           onPress={() => navigation.navigate('My Farm')}
//           style={styles.drawerItem}
//         />
//         <DrawerItem
//           label="Billing and Invoices"
//           onPress={() => navigation.navigate('Billing')}
//           style={styles.drawerItem}
//         />
//         <DrawerItem
//           label="Feed Store"
//           onPress={() => navigation.navigate('Feed Store')}
//           style={styles.drawerItem}
//         />
//         <DrawerItem
//           label="Market/Auction"
//           onPress={() => navigation.navigate('Market')}
//           style={styles.drawerItem}
//         />
//         <DrawerItem
//           label="Drug Store"
//           onPress={() => navigation.navigate('Store')}
//           style={styles.drawerItem}
//         />
//         {/* <DrawerItem
//           label="Agrieldo (AI)"
//           onPress={() => navigation.navigate('Education')}
//           style={styles.drawerItem}
//         /> */}
//         <DrawerItem
//           label="Request Vet"
//           onPress={() => navigation.navigate('VetPermission')}
//           style={styles.drawerItem}
//         />
//       </View>

//       {/* Logout Section */}
//       <View style={styles.logoutContainer}>
//         <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
//           <Text style={styles.logoutText}>Logout</Text>
//         </TouchableOpacity>
//       </View>
//     </ScrollView>
//   );
// };

// const FarmerDrawerNavigator = () => (
//   <Drawer.Navigator
//     initialRouteName="Home"
//     screenOptions={{
//       headerShown: true,
//       drawerStyle: {
//         backgroundColor: '#f7f7f7',
//         width: 240,
//       },
//       drawerLabelStyle: {
//         color: '#333333',
//         fontWeight: 'bold',
//         fontSize: 14, // Adjusted font size for readability
//       },
//       drawerItemStyle: {
//         marginVertical: 5,
//         backgroundColor: '#fff',
//         borderRadius: 10,
//       },
//     }}
//     drawerContent={props => <CustomDrawerContent {...props} />}>
//     {/* Home Screen now goes to FarmerStackNavigator */}
//     <Drawer.Screen
//       name="Home"
//       component={FarmerStackNavigator}
//       options={{
//         title: 'Agrieldo',
//         drawerLabelStyle: {
//           fontSize: 16, // Slightly smaller font size for label
//         },
//         drawerItemStyle: {
//           backgroundColor: '#ffa500', // Highlight color for Home in the drawer
//           borderRadius: 10,
//         },
//       }}
//     />

//     {/* Other screens in the Drawer */}
//     <Drawer.Screen
//       name="My Farm"
//       component={AccountScreen}
//       options={{title: 'My Farm'}}
//     />
//     <Drawer.Screen
//       name="Billing"
//       component={BillingScreen}
//       options={{title: 'Billing and Invoices'}}
//     />
//     <Drawer.Screen
//       name="Feed Store"
//       component={FeedStoreScreen}
//       options={{title: 'Feed Store'}}
//     />
//     <Drawer.Screen
//       name="Market"
//       component={MarketScreen}
//       options={{title: 'Market/Auction'}}
//     />
//     <Drawer.Screen
//       name="Store"
//       component={StoreScreen}
//       options={{title: 'Drug Store'}}
//     />
//     <Drawer.Screen
//       name="VetPermission"
//       component={VetRequestPermissionScreen}
//       options={{title: 'Request Vet'}}
//     />
//     <Drawer.Screen
//       name="VetRequestsOverview"
//       component={VetRequestsOverviewScreen}
//       options={{title: 'Vet Requests'}}
//     />
//     {/* <Stack.Screen
//       name="VetRequestsDashboard"
//       component={DashboardScreen}
//       options={{title: 'My Vet Requests'}}
//     /> */}
//   </Drawer.Navigator>
// );

// const styles = StyleSheet.create({
//   drawerContent: {
//     flex: 1,
//     paddingTop: 20,
//   },
//   section: {
//     marginBottom: 20,
//   },
//   drawerItem: {
//     backgroundColor: '#e0e0e0', // Light gray background for items
//     paddingVertical: 8, // Reduced padding to make items smaller
//     paddingHorizontal: 12,
//     borderRadius: 8, // Smaller border radius for smoother corners
//     marginBottom: 8,
//     marginHorizontal: 8,
//   },
//   agrieldoItem: {
//     backgroundColor: '#ffa500', // Highlight Agrieldo item
//     padding: 12,
//     borderRadius: 10,
//     marginBottom: 8,
//   },
//   logoutContainer: {
//     position: 'absolute',
//     bottom: 20,
//     width: '100%',
//     paddingHorizontal: 16,
//   },
//   logoutButton: {
//     backgroundColor: '#ff5733',
//     paddingVertical: 10,
//     borderRadius: 8, // Rounded corners for logout button
//     alignItems: 'center',
//   },
//   logoutText: {
//     color: '#fff',
//     fontSize: 16, // Smaller font size
//     fontWeight: 'bold',
//   },
// });

// export default FarmerDrawerNavigator;

// File: src/navigation/DrawerNavigator.js
import React, {useEffect, useState} from 'react';
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

import FarmerTabNavigator from './FarmerTabNavigator';
import AccountScreen from '../screens/AccountScreen';
import BillingScreen from '../screens/BillingScreen';
import MarketScreen from '../screens/MarketScreen';
import StoreScreen from '../screens/StoreScreen';
import ChatGPT from '../screens/ChatGPT';
import VetRequestListScreen from '../screens/VetRequestsListScreen';
import {createStackNavigator} from '@react-navigation/stack';
import AnimalDetailsScreen from '../screens/AnimalDetailsScreen';
import MilkDetailScreen from '../screens/MilkDetailScreen';
import FarmDashboard from '../screens/FarmDashboard';
import VetRequestPermissionScreen from '../screens/VetRequestPermissionScreen';
import FeedStoreScreen from '../screens/FeedStoreScreen';
import VetRequestsOverviewScreen from '../screens/VetRequestsOverviewScreen';
import {fetchUserProfile, updateProfileImage} from '../utils/api';

// Stack for Farmer Section
const Stack = createStackNavigator();
const FarmerStackNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name="FarmerHome"
      component={FarmerTabNavigator}
      options={{headerShown: false}}
    />
    <Stack.Screen name="My Farm" component={AccountScreen} />
    <Stack.Screen name="Billing" component={BillingScreen} />
    <Stack.Screen name="Feed Store" component={FeedStoreScreen} />
    <Stack.Screen name="Market" component={MarketScreen} />
    <Stack.Screen name="Store" component={StoreScreen} />
    <Stack.Screen name="Education" component={ChatGPT} />
    <Stack.Screen
      name="VetRequestsOverview"
      component={VetRequestsOverviewScreen}
    />
    <Stack.Screen
      name="AnimalDetails"
      component={AnimalDetailsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="MilkDetail"
      component={MilkDetailScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="FarmDashboard"
      component={FarmDashboard}
      options={{title: 'Farm Dashboard'}}
    />
  </Stack.Navigator>
);

const Drawer = createDrawerNavigator();

// Custom Drawer
const CustomDrawerContent = props => {
  const [loading, setLoading] = useState(false); // in case you fetch profile later
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
      {/* Profile Header */}
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
            <Text style={styles.phoneNUmber}>{user?.phone_number || ''}</Text>
            <Text style={styles.profileRole}>{user?.email || ''}</Text>
          </>
        )}
      </View>

      {/* Drawer items */}
      <View style={styles.drawerList}>
        <DrawerItemList {...props} />
      </View>

      {/* Logout */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#333" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

const FarmerDrawerNavigator = () => (
  <Drawer.Navigator
    initialRouteName="FarmerHome"
    drawerContent={props => <CustomDrawerContent {...props} />}
    screenOptions={{
      headerStyle: {backgroundColor: '#ffa500'},
      headerTintColor: '#fff',
      drawerActiveTintColor: '#ffa500',
      drawerActiveBackgroundColor: '#ffe8cc', // ✅ highlight background
      drawerInactiveTintColor: '#333',
      drawerLabelStyle: {marginLeft: -10, fontSize: 16},
      drawerStyle: {width: 240},
    }}>
    <Drawer.Screen
      name="Farmer Home"
      component={FarmerStackNavigator}
      options={{
        title: 'Agrieldo',
        drawerIcon: ({color, size}) => (
          <Ionicons name="home-outline" size={size} color={color} />
        ),
      }}
      initialParams={{screen: 'FarmerHome'}} // 👈 ensures drawer Home goes to FarmerHome
    />

    <Drawer.Screen
      name="My Farm"
      component={AccountScreen}
      options={{
        title: 'My Farm',
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
      component={FeedStoreScreen}
      options={{
        title: 'My Store',
        drawerIcon: ({color, size}) => (
          <Ionicons name="cart-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Market"
      component={MarketScreen}
      options={{
        title: 'Market/Auction',
        drawerIcon: ({color, size}) => (
          <Ionicons name="storefront-outline" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen
      name="Store"
      component={StoreScreen}
      options={{
        title: 'Drug Store',
        drawerIcon: ({color, size}) => (
          <Ionicons name="medkit-outline" size={size} color={color} />
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
    {/* <Drawer.Screen
      name="VetRequestsOverview"
      component={VetRequestsOverviewScreen}
      options={{
        title: 'Vet Requests',
        drawerIcon: ({color, size}) => (
          <Ionicons name="list-outline" size={size} color={color} />
        ),
      }}
    /> */}
  </Drawer.Navigator>
);

export default FarmerDrawerNavigator;

// Styles (reused from Vet drawer)
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
  phoneNUmber: {
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
  profileImageWrapper: {
    width: 70, // match image width
    height: 70, // match image height
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative', // required for absolute positioning of edit button
    overflow: 'visible', // allow the button to sit slightly outside the image bounds
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
