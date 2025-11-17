import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Alert, ActivityIndicator, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './store';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ✅ IMPORT CART PROVIDER
import {CartProvider} from './src/context/CartContext';

// Firebase imports
import {getApp} from '@react-native-firebase/app';
import {
  getMessaging,
  getToken,
  requestPermission,
  onMessage,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';

// Import screens
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import LandingPageScreen from './src/screens/LandingPageScreen';
import VetDrawerNavigator from './src/api/VetDrawerNavigator';
import FarmerDrawerNavigator from './src/api/FarmerDrawerNavigator';
import StaffDrawerNavigator from './src/api/StaffDrawerNavigator';
import VetRequestScreen from './src/screens/VetRequestScreen';
import ViewAnimalsScreen from './src/screens/ViewAnimalsScreen';
import AnimalFullProfile from './src/screens/AnimalFullProfile';
import FarmDashboard from './src/screens/FarmDashboard';
import ProductionHistoryScreen from './src/screens/ProductionHistoryScreen';
import VetFarmsScreen from './src/screens/VetFarmsScreen';
import FeedStoreScreen from './src/screens/FeedStoreScreen';
import FarmTeamScreen from './src/screens/FarmTeamScreen';
import FeedCategoriesScreen from './src/screens/FeedCategoriesScreen';
import FeedProductsScreen from './src/screens/FeedProductsScreen';
import FeedProductDetailScreen from './src/screens/FeedProductDetailScreen';
import FeedActivityScreen from './src/screens/FeedActivityScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import OrderSuccessScreen from './src/screens/OrderSuccessScreen';
import DrugCategoriesScreen from './src/screens/DrugCategoriesScreen';
import DrugProductsScreen from './src/screens/DrugProductsScreen';
import DrugProductDetailScreen from './src/screens/DrugProductDetailScreen';
import SellAnimalScreen from './src/screens/SellAnimalScreen';
import MarketListingsScreen from './src/screens/MarketListingsScreen';
import MarketDetailsScreen from './src/screens/MarketDetailsScreen';

const Stack = createStackNavigator();

export default function App() {
  const app = getApp();
  const messagingInstance = getMessaging(app);

  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [userType, setUserType] = useState(null);

  const checkLoginStatus = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');
      const userType = await AsyncStorage.getItem('user_type');

      if (accessToken && userType) {
        setIsLoggedIn(true);
        setUserType(userType);
      } else {
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('Error loading login status:', error);
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const getAndStoreToken = async userType => {
    const token = await getToken(messagingInstance);
    console.log(`${userType} FCM Token:`, token);

    try {
      await fetch('http://api.agrieldo.com/api/accounts/update-fcm-token/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user_type: userType, token}),
      });
    } catch (error) {
      console.error(`Error saving ${userType} FCM token:`, error);
    }
  };

  useEffect(() => {
    const setupMessaging = async () => {
      await requestPermission(messagingInstance);

      if (userType) {
        await getAndStoreToken(userType);
      }

      const unsubscribeForeground = onMessage(
        messagingInstance,
        async remoteMessage => {
          Alert.alert(
            remoteMessage.notification?.title,
            remoteMessage.notification?.body,
            [
              {
                text: 'View',
                onPress: () => {
                  if (remoteMessage.data?.type === 'vet_request') {
                    navigation.navigate('VetRequestScreen');
                  }
                },
              },
              {text: 'Cancel'},
            ],
          );
        },
      );

      setBackgroundMessageHandler(messagingInstance, async remoteMessage => {
        console.log('Notification received in background:', remoteMessage);
      });

      return unsubscribeForeground;
    };

    setupMessaging();
  }, [userType]);

  if (isLoggedIn === null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#333333" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      {/* ✅ CartProvider MUST wrap NavigationContainer */}
      <CartProvider>
        <NavigationContainer style={{flex: 1, backgroundColor: '#ffffff'}}>
          <GestureHandlerRootView style={{flex: 1, backgroundColor: '#ffffff'}}>
            <Stack.Navigator initialRouteName="Login">
              <Stack.Screen
                name="LandingPageScreen"
                component={LandingPageScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="Login"
                component={LoginScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="Signup"
                component={SignupScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="FeedActivity"
                component={FeedActivityScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="VetDrawerNavigator"
                component={VetDrawerNavigator}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="StaffDrawerNavigator"
                component={StaffDrawerNavigator}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="FarmerDrawerNavigator"
                component={FarmerDrawerNavigator}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="FeedStoreScreen"
                component={FeedStoreScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="FarmTeam"
                component={FarmTeamScreen}
                options={{headerShown: true}}
              />

              <Stack.Screen
                name="ProductionHistoryScreen"
                component={ProductionHistoryScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="VetRequestScreen"
                component={VetRequestScreen}
                options={{headerShown: true}}
              />

              <Stack.Screen
                name="VetFarmsScreen"
                component={VetFarmsScreen}
                options={{headerShown: true}}
              />

              <Stack.Screen
                name="ViewAnimals"
                component={ViewAnimalsScreen}
                options={{headerShown: true}}
              />

              <Stack.Screen
                name="AnimalProfile"
                component={AnimalFullProfile}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="FarmDashboard"
                component={FarmDashboard}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="FeedCategories"
                component={FeedCategoriesScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="FeedProducts"
                component={FeedProductsScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="FeedDetails"
                component={FeedProductDetailScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Cart"
                component={CartScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="Checkout"
                component={CheckoutScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="OrderSuccess"
                component={OrderSuccessScreen}
                options={{headerShown: false}}
              />

              <Stack.Screen
                name="DrugCategories"
                component={DrugCategoriesScreen}
                options={{headerShown: true, title: 'Drug Categories'}}
              />

              <Stack.Screen
                name="DrugProducts"
                component={DrugProductsScreen}
                options={{headerShown: true}}
              />

              <Stack.Screen
                name="DrugDetails"
                component={DrugProductDetailScreen}
                options={{headerShown: false}}
              />
              <Stack.Screen
                name="SellAnimal"
                component={SellAnimalScreen}
                options={{headerShown: true, title: 'Sell Animal'}}
              />
              <Stack.Screen
                name="MarketListings"
                component={MarketListingsScreen}
                options={{headerShown: true, title: 'Market'}}
              />
              <Stack.Screen
                name="MarketDetails"
                component={MarketDetailsScreen}
                options={{headerShown: false}}
              />
            </Stack.Navigator>
          </GestureHandlerRootView>
        </NavigationContainer>
      </CartProvider>
    </Provider>
  );
}
