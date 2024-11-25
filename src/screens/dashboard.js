import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Image,
  Switch,
  PermissionsAndroid,
  Platform 
  
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios'; // Ensure axios is installed in your project
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker'; // Updated import
import jwt_decode from 'jwt-decode';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons'; // Use any icon library you prefer
import Geolocation from 'react-native-geolocation-service';





const axiosInstance = axios.create({
  baseURL: 'http://104.248.23.245/',
});

const screenWidth = Dimensions.get('window').width;

const DashboardScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [vetRequestModalVisible, setVetRequestModalVisible] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [feed, setFeed] = useState([]); // Start with an empty feed
  const [image, setImage] = useState(null);
  const [actionModalVisible, setActionModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [video, setSelectedVideo] = useState(null);
  const [postVetContent, setPostVetContent] = useState('');
  const [selectedAnimalId, setSelectedAnimalId] = useState('');
  const [animals, setAnimals] = useState([]); // To hold the list of animals
  const [description, setProblemDescription] = useState('');
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [farmerLocation, setFarmerLocation] = useState(null); // For storing the farmer's location








  // Fetch posts from API when the component mounts
  useEffect(() => {
    fetchPosts();
  }, []);

  // Function to fetch posts from the API
  const fetchPosts = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('access_token');

      const response = await axios.get('http://104.248.23.245/api/feed/posts/', {
        headers: {
          Authorization: `Bearer ${accessToken}`, // Include the token in the headers
        },
      });

      setFeed(response.data); // Set the fetched posts to state
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };
  const isTokenExpired = (token) => {
    if (!token) return true; // If there's no token, consider it expired
    try {
      const decodedToken = jwt_decode(token); // Decode the token
      return decodedToken.exp * 1000 < Date.now(); // Check expiry
    } catch (error) {
      console.error('Error decoding token:', error);
      return true; // Treat as expired if there's an error
    }
  };
  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token'); // Retrieve refresh token
      const response = await axios.post('http://104.248.23.245/api/accounts/api/token/refresh/', {
        refresh: refreshToken,
      });
      const newAccessToken = response.data.access; // Get new access token
      await AsyncStorage.setItem('access_token', newAccessToken); // Save new access token
      return newAccessToken;
    } catch (error) {
      console.error('Error refreshing token:', error);
      return null; // Return null if token refresh fails
    }
  };

  axiosInstance.interceptors.request.use(
    async (config) => {
      let token = await AsyncStorage.getItem('access_token');
  
      // Check if the token is expired
      if (isTokenExpired(token)) {
        token = await refreshToken(); // Get new token
      }
  
      // Add Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
  
  // Function to handle post submission
  const handlePostSubmit = async () => {
    console.log('handlePostSubmit called'); // Add this line to check if the function is triggered

    if (postContent.trim() || image) {
      const token = await AsyncStorage.getItem('access_token'); // Ensure the key matches the stored token

      // Create a new FormData object to handle file uploads
      const newPost = new FormData();
      newPost.append('content', postContent); // Append the content

      if (image) {
        newPost.append('image', {
          uri: image,
          type: 'image/jpeg', // Adjust the mime type if necessary
          name: 'image.jpg', // Set a name for the image file
        });
      }
      if (video) {
        newPost.append('video', {
          uri: video,
          type: 'video/mp4', // Change as needed
          name: 'video.mp4', // Change as needed
        });
      }
  
      if (selectedImage) {
        newPost.append('image', {
          uri: selectedImage.uri,
          type: selectedImage.type,
          name: selectedImage.fileName,
        });
      }
  
      if (video) {
        newPost.append('video', {
          uri: video.uri,
          type: video.type,
          name: video.fileName,
        });
      }

      console.log('Submitting post:', newPost);
      try {
        const response = await axios.post('http://104.248.23.245/api/feed/posts/', newPost, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Set the content type for FormData
          },
        });

        // Update feed with the new post
        setFeed([response.data, ...feed]);
        setPostContent('');
        setImage(null);
      } catch (error) {
        console.error('Error posting feed:', error.response.data);
        
        if (error.response) {
          if (error.response.status === 400) {
            alert('Please check the content and image. There might be an issue with the input format.');
          } else if (error.response.status === 401) {
            const newToken = await refreshToken();
            if (newToken) {
              try {
                const retryResponse = await axios.post('http://104.248.23.245/api/feed/posts/', newPost, {
                  headers: {
                    Authorization: `Bearer ${newToken}`,
                    'Content-Type': 'multipart/form-data',
                  },
                });
                
                setFeed([retryResponse.data, ...feed]);
                setModalVisible(false);
                setPostContent('');
                setImage(null);
              } catch (retryError) {
                console.error('Error posting feed on retry:', retryError);
                alert('Failed to post on retry. Please try again.');
              }
            } else {
              console.error('Could not refresh token');
              alert('Session expired. Please log in again.');
            }
          } else {
            alert('Failed to post. Please try again.'); // General error for other status codes
          }
        } else {
          alert('Failed to post. Please check your internet connection.');
        }
      }
    } else {
      alert('Post content or image is required.');
    }
  };

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const response = await axiosInstance.get('api/animals/dairy-cows/'); // Ensure the endpoint is correct
      setAnimals(response.data); // Set the fetched animals
    } catch (error) {
      console.error('Failed to fetch animals:', error);
      Alert.alert('Error', 'Failed to fetch animals');
    } finally {
      setLoading(false); // Ensure loading state is updated
    }
  };
  useEffect(() => {
    const requestLocationPermission = async () => {
      const hasPermission = await checkAndRequestLocationPermission();
      if (hasPermission) {
        getFarmerLocation();
      } else {
        Alert.alert('Permission Denied', 'Location access is required to proceed.');
      }
    };
  
    requestLocationPermission();
  }, []);

  // Request location permission (Android only; iOS handled via Info.plist)
  const checkAndRequestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'We need access to your location to find the closest vet.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS automatically handles permissions via Info.plist
    } catch (err) {
      console.warn('Permission request failed:', err);
      return false;
    }
  };

  // Function to get the farmer's current location
  const getFarmerLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setFarmerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Unable to get your location.');
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      }
    );
  };
  

    const handleSubmitRequest = async () => {
      const formData = new FormData();
    
      // Append the problem description and animal details
      formData.append('description', description); // Problem description
      formData.append('animal_id', selectedAnimalId); // Selected animal ID
      formData.append('is_urgent', isUrgent ? 'true' : 'false'); // Is urgent
    
      // Append location if available
      if (farmerLocation) {
        formData.append('location', JSON.stringify(farmerLocation)); // Location
      } else {
        Alert.alert('Error', 'Could not get your location.');
        return;
      }
    
      // Append image if selected
      if (image) {
        formData.append('image', {
        uri: image.uri,
        type: 'image/jpeg',
        name: 'image.jpg',
      });
    }
  
    // Append video if selected
    if (video) {
      formData.append('video', {
        uri: video.uri,
        type: 'video/mp4',
        name: 'video.mp4',
      });
    }
  
    // Token refresh
    try {
      const newToken = await refreshToken(); // Ensure the refreshToken function is implemented
      if (!newToken) {
        Alert.alert('Session expired', 'Please log in again.');
        return;
      }
      console.log('description:', description);
      console.log('animal_id:', selectedAnimalId);
      console.log('is_urgent:', isUrgent ? 'true' : 'false');
      console.log('location:', JSON.stringify(farmerLocation));
      // Make the API request to submit the vet request
      const response = await fetch('http://104.248.23.245:8000/api/vet_requests/requests/create/', {
        method: 'POST',
        body: formData,
        headers: {
          Authorization: `Bearer ${newToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      const data = await response.json();
      console.log('Request submitted:', data);
  
      // Reset form data and close modal after success
      setVetRequestModalVisible(false);
      setDescription(''); // Reset problem description
      setSelectedAnimalId(null); // Reset selected animal
      setImage(null); // Clear image
      setVideo(null); // Clear video
      setIsUrgent(false); // Reset urgency flag
      setFarmerLocation(null); // Clear location
  
      Alert.alert('Success', 'Your request has been submitted successfully!');
    } catch (error) {
      console.error('Error submitting request:', error);
      Alert.alert('Error', 'Could not submit your request. Please try again.');
    }
  };
  
  
  




  const requestPermissions = async () => {
    const cameraPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
    const galleryPermission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);

    if (cameraPermission !== PermissionsAndroid.RESULTS.GRANTED || galleryPermission !== PermissionsAndroid.RESULTS.GRANTED) {
      Alert.alert('Permissions not granted', 'Please allow access to the camera and gallery.');
      return false;
    }
    return true;
  };

  const pickImageFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.error) {
          console.log('ImagePicker Error: ', response.error);
        } else {
          setImage(response.assets[0].uri); // Set the selected image URI
        }
      }
    );
  };

  // Function to capture an image using the camera
  const captureImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    launchCamera(
      {
        mediaType: 'photo',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.error) {
          console.log('Camera Error: ', response.error);
        } else {
          setImage(response.assets[0].uri); // Set the captured image URI
        }
      }
    );
  };

  // Function to select a video from the gallery
  const pickVideoFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    launchImageLibrary(
      {
        mediaType: 'video',
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled video picker');
        } else if (response.error) {
          console.log('VideoPicker Error: ', response.error);
        } else if (response.assets && response.assets.length > 0) {
          setSelectedVideo(response.assets[0].uri); // Set the selected video URI
        } else {
          console.log('No video selected or unexpected response:', response);
        }
      }
    );
  };

  // Function to capture a video using the camera
  const captureVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    launchCamera(
      {
        mediaType: 'video',
        quality: 1,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled video capture');
        } else if (response.error) {
          console.log('Camera Error: ', response.error);
        } else if (response.assets && response.assets.length > 0) {
          setSelectedVideo(response.assets[0].uri); // Set the captured video URI
        } else {
          console.log('No video captured or unexpected response:', response);
        }
      }
    );
  };

  const handleActionSelect = (action) => {
    setActionModalVisible(false);
  
    if (action === 'createPost') {
      setModalVisible(true);
      console.log("Creating Post Modal Opened");
    } else if (action === 'requestVet') {
      setVetRequestModalVisible(true);
      console.log("Request Vet Modal Opened");
    } else {
      alert(`Action selected: ${action}`);
    }
  };
  
  

  const handlePlayPress = () => {
    setIsPlaying(!isPlaying);
  };
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.feed}>
        {feed.map((item) => (
          <View key={item.id} style={styles.postContainer}>
            <Text style={styles.postUser}>{item.author}</Text>
      {item.image ? (
        <Image 
          source={{ uri: item.image }}  // Use the animal's image URI
          style={styles.postImage}            // Apply styles for the image
        />
      ) : null}

{/* Conditionally render the video only if it's available */}
{item.video ? (
  <View style={styles.videoContainer}>
    <Video
      source={{ uri: item.video }} 
      style={styles.animalMedia} // Use the animal's video URI
      controls // Add video controls
      resizeMode="contain" // Resize the video to fit
      paused={!isPlaying} // Control playback based on isPlaying state
      onError={(error) => console.error('Video loading error:', error)} // Log any loading errors
    />
    <TouchableOpacity style={styles.playButton} onPress={handlePlayPress}>
      <Icon name="play-circle" size={60} color="#fff" />
      {/* Add any text you want here, wrapped in <Text> */}
      <Text style={{ color: '#fff', textAlign: 'center' }}>Play Video</Text>
    </TouchableOpacity>
  </View>
) : null}


            <Text style={styles.postContent}>{item.content}</Text>
            <Text style={styles.postTime}>{item.created_at}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setActionModalVisible(true)}>
        <View style={styles.iconContainer}>
          <AntDesign name="plus" size={24} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* Action Modal */}
      <Modal
        animationType="slide"
        transparent
        visible={actionModalVisible}
        onRequestClose={() => setActionModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an Action</Text>
            <TouchableOpacity onPress={() => handleActionSelect('createPost')} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Create Post</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleActionSelect('viewReports')} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>View Reports</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleActionSelect('requestVet')} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Request Vet</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActionModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for New Post */}
      <Modal
        animationType="slide"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create a New Post</Text>
            <TextInput
              style={styles.postInput}
              placeholder="What's happening?"
              value={postContent}
              onChangeText={setPostContent}
              multiline
            />
            <TouchableOpacity onPress={pickImageFromGallery} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Select Image from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={captureImage} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Capture Image with Camera</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}

            <TouchableOpacity onPress={pickVideoFromGallery} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Select Video from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={captureVideo} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Capture Video with Camera</Text>
            </TouchableOpacity>
            {video && (
              <Video
                source={{ uri: video }} // The URI of the video
                style={styles.previewVideo}
                resizeMode="contain" // Adjust how the video is resized
                controls={true} // Show video controls (play, pause, etc.)
              />
            )}

            <TouchableOpacity onPress={handlePostSubmit} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal for Vet Request */}
      <Modal
        animationType="slide"
        transparent
        visible={vetRequestModalVisible}
        onRequestClose={() => setVetRequestModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Request a Vet</Text>
            <Picker
        selectedValue={selectedAnimalId}
        style={styles.picker}
        onValueChange={(itemValue) => setSelectedAnimalId(itemValue)}
      >
        <Picker.Item label="Select an Animal" value="" />
        {animals.map((animal) => (
          <Picker.Item
            key={animal.id}
            label={`${animal.name} (${animal.species})`}
            value={animal.id}
          />
        ))}
      </Picker>
      <Text>Selected Animal ID: {selectedAnimalId}</Text>
            <TextInput
              style={styles.postInput}
              placeholder="Describe your issue..."
              value={description}
              onChangeText={setProblemDescription}
              multiline
            />
            <TextInput
              style={styles.locationInput}
              placeholder="Location...?"
              value={location}
              onChangeText={setLocation}
              multiline
            />
            <TouchableOpacity onPress={pickImageFromGallery} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Select Image from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={captureImage} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Capture Image with Camera</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.previewImage} />}

            <TouchableOpacity onPress={pickVideoFromGallery} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Select Video from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={captureVideo} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Capture Video with Camera</Text>
            </TouchableOpacity>
            {video && (
              <Video
                source={{ uri: video }} // The URI of the video
                style={styles.previewVideo}
                resizeMode="contain" // Adjust how the video is resized
                controls={true} // Show video controls (play, pause, etc.)
              />
            )}
      <View style={styles.switchContainer}>
        <Text>Is this urgent?</Text>
        <Switch
          value={isUrgent}
          onValueChange={setIsUrgent}
        />
      </View>
            <TouchableOpacity onPress={handleSubmitRequest} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Submit Request</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setVetRequestModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  feed: {
    padding: 16,
  },
  postContainer: {
    marginBottom: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  postUser: {
    fontWeight: 'bold',
  },
  
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginVertical: 8,
  },
  postContent: {
    fontSize: 16,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
  },
  postTime: {
    fontSize: 12,
    color: '#888',
    marginTop: 8,
  },
  previewVideo: {
    width: '100%', // Set the width as needed
    height: 200, // Set the height as needed
  },
  fab: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FFA500',
    borderRadius: 50,
    elevation: 8,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  postInput: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  locationInput: {
    width: '100%',
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  imagePickerButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
  },
  imagePickerText: {
    color: 'white',
  },
  previewImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginTop: 10,
  },
  submitButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#888',
  },
  actionButton: {
    backgroundColor: '#FFA500',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  videoContainer: {
    position: 'relative', // Required for absolute positioning of the play button
    width: '100%', // Full width of the container
    height: 300, // Set a specific height for the video
    backgroundColor: '#000', // Black background for better visibility
    borderRadius: 8, // Rounded corners (optional)
    marginVertical: 10, // Space above and below the video
  },
  animalMedia: {
    width: '100%', // Full width of the video
    height: '100%', // Full height of the video
    borderRadius: 8, // Rounded corners (optional)
  },
  playButton: {
    position: 'absolute',
    top: '50%', // Center vertically
    left: '50%', // Center horizontally
    marginLeft: -30, // Half of icon width
    marginTop: -30, // Half of icon height
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default DashboardScreen;
