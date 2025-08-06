// File: src/screens/LoginScreen.js

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {CommonActions} from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const login = async () => {
    if (!username || !password) {
      Alert.alert('Validation Error', 'Username and password are required.');
      return;
    }

    try {
      const response = await axios.post(
        'http://192.168.100.4:8000/api/accounts/api/token/',
        {
          username,
          password,
        },
      );

      const {access, refresh, user_type} = response.data;

      // Store tokens and user type in AsyncStorage
      await AsyncStorage.setItem('access_token', access);
      await AsyncStorage.setItem('refresh_token', refresh);
      await AsyncStorage.setItem('user_type', user_type.toString());

      //      // Navigate based on user type
      //      if (user_type.toString() === 'vet') {
      //        navigation.navigate('VetDrawerNavigator');
      //      } else {
      //        navigation.navigate('FarmerDrawerNavigator');
      //         { name: 'My Farm' },
      //      }

      if (user_type.toString() === 'vet') {
        navigation.navigate('VetDrawerNavigator');
      } else {
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'FarmerDrawerNavigator',
                state: {
                  index: 1, // Index of "My Farm" inside FarmerStackNavigator
                  routes: [
                    {
                      name: 'Home', // This points to FarmerStackNavigator
                      state: {
                        routes: [
                          {name: 'My Farm'}, // Inside FarmerStackNavigator
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          }),
        );
      }
    } catch (error) {
      console.error('Login failed:', error);
      Alert.alert('Login Failed', 'Please check your credentials.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#333333"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#333333"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={login}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.signupButton}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#ffa500',
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#333333',
    borderBottomWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333333',
  },
  buttonContainer: {
    backgroundColor: '#333333',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffa500',
    fontSize: 18,
    fontWeight: '600',
  },
  signupButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  signupText: {
    color: '#ffa500',
    fontSize: 16,
  },
});

export default LoginScreen;
