// File: src/screens/ChatGPT.js

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  TextInput,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Animated,
  Easing,
  Image,
  Platform,
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';

// Stub for audio recording if module is not installed
const AudioRecord = Platform.select({
  ios: {start: () => {}, stop: () => Promise.resolve('')},
  android: {start: () => {}, stop: () => Promise.resolve('')},
});

const ChatGPT = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const animValues = useRef({}).current;
  const [recording, setRecording] = useState(false);
  const [showRecordingIndicator, setShowRecordingIndicator] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse animation for recording indicator
  useEffect(() => {
    if (showRecordingIndicator) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.setValue(1);
    }
  }, [showRecordingIndicator]);

  useEffect(() => {
    messages.forEach(msg => {
      if (!animValues[msg.id]) {
        animValues[msg.id] = new Animated.Value(0);
        Animated.timing(animValues[msg.id], {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start();
      }
    });
  }, [messages]);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scaleAnim, {toValue: 0.9, useNativeDriver: true}).start();
  const onPressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

  const handleSendText = () => {
    if (!input.trim()) return;
    const id = Date.now().toString();
    setMessages(prev => [
      ...prev,
      {id, text: input, sender: 'user', type: 'text'},
    ]);
    setInput('');
    // TODO: call API to send text
  };

  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel || response.error) return;
      const asset = response.assets[0];
      const id = Date.now().toString();
      setMessages(prev => [
        ...prev,
        {id, uri: asset.uri, sender: 'user', type: 'image'},
      ]);
      // TODO: upload image to API
    });
  };

  const toggleRecording = () => {
    if (!recording) {
      setRecording(true);
      setShowRecordingIndicator(true);
      AudioRecord.start();
    } else {
      AudioRecord.stop().then(file => {
        setRecording(false);
        setShowRecordingIndicator(false);
        const id = Date.now().toString();
        setMessages(prev => [
          ...prev,
          {id, audio: file, sender: 'user', type: 'audio'},
        ]);
        // TODO: upload audio to API
      });
    }
  };

  const renderItem = ({item}) => {
    const styleWrap = [
      styles.message,
      {
        alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
        backgroundColor: item.sender === 'user' ? '#ffa500' : '#e0e0e0',
        opacity: animValues[item.id] || 0,
        transform: [
          {
            scale:
              animValues[item.id]?.interpolate({
                inputRange: [0, 1],
                outputRange: [0.8, 1],
              }) || 1,
          },
        ],
      },
    ];

    return (
      <Animated.View style={styleWrap}>
        {item.type === 'text' && (
          <Text
            style={[
              styles.messageText,
              {color: item.sender === 'user' ? '#fff' : '#333'},
            ]}>
            {item.text}
          </Text>
        )}
        {item.type === 'image' && (
          <Image source={{uri: item.uri}} style={styles.image} />
        )}
        {item.type === 'audio' && (
          <Text style={styles.messageText}>🔊 Voice Message</Text>
        )}
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Recording Indicator */}
      {showRecordingIndicator && (
        <View style={styles.recordingBanner}>
          <Animated.View
            style={[styles.pulseDot, {transform: [{scale: pulseAnim}]}]}
          />
          <Text style={styles.recordingText}>Recording...</Text>
        </View>
      )}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{paddingVertical: 16}}
      />

      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleImagePick}>
          <Icon name="camera-alt" size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={toggleRecording}>
          <Icon
            name={recording ? 'stop' : 'mic'}
            size={24}
            color={recording ? '#ff3b30' : '#000'}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type..."
          placeholderTextColor="#999"
        />
        <Animated.View style={{transform: [{scale: scaleAnim}]}}>
          <TouchableOpacity
            style={styles.sendButton}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={handleSendText}>
            <Icon name="send" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>

      <TouchableOpacity
        style={styles.loginLink}
        onPress={() => navigation.navigate('Login')}>
        <Icon name="login" size={16} color="#007AFF" />
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  recordingBanner: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#333',
    paddingVertical: 6,
    zIndex: 10,
  },
  pulseDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff3b30',
    marginRight: 8,
  },
  recordingText: {
    color: '#fff',
    fontSize: 14,
  },
  container: {flex: 1, backgroundColor: '#fafafa'},
  message: {
    margin: 8,
    padding: 12,
    borderRadius: 12,
    maxWidth: '75%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  messageText: {fontSize: 14},
  image: {width: 150, height: 100, borderRadius: 8, marginTop: 4},
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  iconButton: {padding: 8},
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    marginHorizontal: 4,
  },
  sendButton: {
    backgroundColor: '#ffa500',
    borderRadius: 20,
    padding: 10,
    marginLeft: 4,
  },
  loginLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
  },
  loginText: {color: '#007AFF', marginLeft: 4, textDecorationLine: 'underline'},
});

export default ChatGPT;
