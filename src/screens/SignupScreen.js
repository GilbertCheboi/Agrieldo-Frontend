// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   Alert,
//   TouchableOpacity,
//   StyleSheet,
// } from 'react-native';
// import {Picker} from '@react-native-picker/picker';
// import axios from 'axios';

// const SignupScreen = ({navigation}) => {
//   const [username, setUsername] = useState('');
//   const [email, setEmail] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [userType, setUserType] = useState(1);

//   const handleSignup = async () => {
//     if (!username || !email || !phoneNumber || !password || !confirmPassword) {
//       Alert.alert('Validation Error', 'All fields are required.');
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert('Validation Error', 'Passwords do not match.');
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append('username', username);
//       formData.append('email', email);
//       formData.append('phone_number', phoneNumber);
//       formData.append('password', password);
//       formData.append('confirm_password', confirmPassword);
//       formData.append('user_type', userType);

//       await axios.post(
//         ' http://192.168.100.4:8000/api/accounts/users/',
//         formData,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       Alert.alert('Signup Successful', 'You can now log in.');
//       navigation.navigate('Login');
//     } catch (error) {
//       console.error('Error Response:', error.response?.data || error.message);

//       if (error.response?.data) {
//         // Flatten Django errors into a single string
//         const errors = error.response.data;
//         let messages = [];

//         for (const [field, msgs] of Object.entries(errors)) {
//           if (Array.isArray(msgs)) {
//             msgs.forEach(msg => messages.push(`${field}: ${msg}`));
//           } else {
//             messages.push(`${field}: ${msgs}`);
//           }
//         }

//         Alert.alert('Signup Failed', messages.join('\n'));
//       } else {
//         Alert.alert(
//           'Signup Failed',
//           'Please check your details and try again.',
//         );
//       }
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Sign Up</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Username"
//         placeholderTextColor="#333333"
//         value={username}
//         onChangeText={setUsername}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         placeholderTextColor="#333333"
//         keyboardType="email-address"
//         value={email}
//         onChangeText={setEmail}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Phone Number"
//         placeholderTextColor="#333333"
//         keyboardType="phone-pad"
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         placeholderTextColor="#333333"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         placeholderTextColor="#333333"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//       />

//       <Text style={styles.label}>I am a:</Text>
//       <Picker
//         selectedValue={userType}
//         style={styles.picker}
//         onValueChange={itemValue => setUserType(itemValue)}>
//         <Picker.Item label="Farmer" value={1} />
//         <Picker.Item label="Vet" value={2} />
//         <Picker.Item label="Staff" value={3} />
//         <Picker.Item label="Mechanization Agent" value={4} />
//       </Picker>

//       <TouchableOpacity style={styles.button} onPress={handleSignup}>
//         <Text style={styles.buttonText}>Sign Up</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     padding: 16,
//     backgroundColor: '#f5f5f5',
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     color: '#ffa500',
//     textAlign: 'center',
//   },
//   input: {
//     height: 50,
//     borderColor: '#333333',
//     borderBottomWidth: 1,
//     marginBottom: 20,
//     paddingHorizontal: 10,
//     fontSize: 16,
//     color: '#333333',
//   },
//   label: {
//     marginVertical: 12,
//     fontSize: 16,
//     color: '#333333',
//   },
//   picker: {
//     height: 50,
//     width: '100%',
//     marginBottom: 20,
//     color: '#333333',
//   },
//   button: {
//     backgroundColor: '#333333',
//     padding: 12,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#ffa500',
//     fontSize: 18,
//     fontWeight: '600',
//   },
// });

// export default SignupScreen;

import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const SignupScreen = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState(1);

  const handleSignup = async () => {
    if (!username || !email || !phoneNumber || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('phone_number', phoneNumber);
      formData.append('password', password);
      formData.append('confirm_password', confirmPassword);
      formData.append('user_type', userType);

      await axios.post(
        'http://api.agrieldo.com/api/accounts/users/',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      Alert.alert('Signup Successful', 'You can now log in.');
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error Response:', error.response?.data || error.message);

      if (error.response?.data) {
        const errors = error.response.data;
        let messages = [];

        for (const [field, msgs] of Object.entries(errors)) {
          if (Array.isArray(msgs)) {
            msgs.forEach(msg => messages.push(`${field}: ${msg}`));
          } else {
            messages.push(`${field}: ${msgs}`);
          }
        }

        Alert.alert('Signup Failed', messages.join('\n'));
      } else {
        Alert.alert(
          'Signup Failed',
          'Please check your details and try again.',
        );
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#333333"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#333333"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        placeholderTextColor="#333333"
        keyboardType="phone-pad"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />

      {/* Password field */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#333333"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowPassword(prev => !prev)}>
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#333333"
          />
        </TouchableOpacity>
      </View>

      {/* Confirm Password field */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Confirm Password"
          placeholderTextColor="#333333"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.eyeButton}
          onPress={() => setShowConfirmPassword(prev => !prev)}>
          <Ionicons
            name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#333333"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>I am a:</Text>
      <Picker
        selectedValue={userType}
        style={styles.picker}
        onValueChange={itemValue => setUserType(itemValue)}>
        <Picker.Item label="Farmer" value={1} />
        <Picker.Item label="Vet" value={2} />
        <Picker.Item label="Staff" value={3} />
        <Picker.Item label="Mechanization Agent" value={4} />
      </Picker>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
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
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#333333',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333333',
    paddingHorizontal: 10,
  },
  eyeButton: {
    padding: 10,
  },
  label: {
    marginVertical: 12,
    fontSize: 16,
    color: '#333333',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    color: '#333333',
  },
  button: {
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
});

export default SignupScreen;
