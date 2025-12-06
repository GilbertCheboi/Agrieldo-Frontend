import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, CommonActions} from '@react-navigation/native';

const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // ✅ NEW
  const navigation = useNavigation();

  const login = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Username and password are required.');
      return;
    }

    try {
      setLoading(true);

      const cleanedUsername = username.trim();
      const cleanedPassword = password.trim();

      const response = await axios.post(
        'http://api.agrieldo.com/api/accounts/api/token/',
        {
          username: cleanedUsername,
          password: cleanedPassword,
        },
      );

      const {access, refresh, user_type} = response.data;

      if (!user_type) {
        throw new Error('User type missing in server response');
      }

      const userType = Number(user_type);
      console.log('▶ Logged in as user type:', userType);

      await AsyncStorage.multiSet([
        ['access_token', access.toString()],
        ['refresh_token', refresh.toString()],
        ['user_type', userType.toString()],
      ]);

      // -------------------------------------------
      // 🚀 ROUTING BASED ON USER TYPE
      // -------------------------------------------
      let routeName = 'FarmerDrawerNavigator'; // default fallback

      if (userType === 5) {
        routeName = 'ManagerDrawerNavigator';
      } else if (userType === 6) {
        routeName = 'ClerkDrawerNavigator';
      } else if (userType === 2) {
        routeName = 'VetDrawerNavigator';
      } else if (userType === 3) {
        routeName = 'StaffDrawerNavigator';
      } else {
        routeName = 'FarmerDrawerNavigator'; // type 1 farmer OR unknown type
      }

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name: routeName}],
        }),
      );
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      Alert.alert('Login Failed', 'Please check your credentials or server.');
    } finally {
      setLoading(false);
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
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#333"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />

      <TouchableOpacity
        style={[styles.buttonContainer, loading && styles.buttonDisabled]}
        onPress={login}
        disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#ffa500" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.signupButton}
        disabled={loading}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

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
  buttonDisabled: {
    opacity: 0.6,
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
