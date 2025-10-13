import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';

const AddPostScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [token, setToken] = useState(null); // State to store token

  // Get the token from AsyncStorage when the screen is loaded
  useEffect(() => {
    const getToken = async () => {
      try {
        const savedToken = await AsyncStorage.getItem('access_token');
        if (savedToken) {
          setToken(savedToken);
          console.log('Retrieved token:', savedToken); // Log the retrieved token
        } else {
          Alert.alert(
            'Error',
            'No authorization token found. Please log in again.',
          );
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken();
  }, []);

  // Function to request camera permission
  const requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'This app needs access to your camera to take pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  const handlePost = async () => {
    if (!token) {
      Alert.alert(
        'Error',
        'No authorization token found. Please log in again.',
      );
      return;
    }

    console.log('Using token for post:', token); // Log the token before sending the request

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (image) {
      formData.append('image', {
        uri: image,
        type: 'image/jpeg', // Change according to your image type
        name: 'post-image.jpg', // Change according to your needs
      });
    }

    try {
      const response = await fetch(
        ' http://192.168.100.4:8000/api/feed/posts/',
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${token}`, // Use the retrieved token here
            'Content-Type': 'multipart/form-data',
          },
          body: formData,
        },
      );

      if (response.ok) {
        navigation.goBack(); // Navigate back after successful post
      } else {
        const errorResponse = await response.json();
        console.error('Error creating post:', errorResponse);
        Alert.alert('Error', errorResponse.detail || 'Failed to create post.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const pickImage = async () => {
    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      console.log('Image library response:', response); // Log the response for debugging
      if (response.didCancel) {
        Alert.alert('Image Selection', 'No image selected.');
      } else if (response.error) {
        Alert.alert('ImagePicker Error', response.error);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      } else {
        Alert.alert('Error', 'Could not retrieve image.');
      }
    });
  };

  const openCamera = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) {
      Alert.alert('Camera permission denied');
      return;
    }

    const options = {
      mediaType: 'photo',
      maxWidth: 1024,
      maxHeight: 1024,
      quality: 1,
    };

    launchCamera(options, response => {
      console.log('Camera response:', response); // Log the response for debugging
      if (response.didCancel) {
        Alert.alert('Camera', 'No image taken.');
      } else if (response.error) {
        Alert.alert('Camera Error', response.error);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      } else {
        Alert.alert('Error', 'Could not retrieve image.');
      }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title:</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <Text style={styles.label}>Content:</Text>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={setContent}
        multiline
      />
      <Button title="Pick an Image" onPress={pickImage} />
      <Button title="Open Camera" onPress={openCamera} />
      {image && <Image source={{uri: image}} style={styles.image} />}
      <Button title="Add Post" onPress={handlePost} color="#007BFF" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  label: {
    marginBottom: 8,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
    borderRadius: 4,
  },
  image: {
    width: '100%',
    height: 200,
    marginVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default AddPostScreen;
