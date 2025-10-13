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
} from 'react-native';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {askChatGPTDB} from '../utils/api';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ChatGPT = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const animValues = useRef({}).current;
  const pulseAnim = useRef(new Animated.Value(1)).current; // 👈 for welcome animation

  // Animate new messages
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

  // Animate welcome placeholder
  useEffect(() => {
    if (messages.length === 0) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
    }
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

  const handleSendText = async () => {
    if (!input.trim()) return;
    const userMessage = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      type: 'text',
    };
    setMessages(prev => [...prev, userMessage]);
    const prompt = input;
    setInput('');

    try {
      const res = await askChatGPTDB(prompt);
      const aiMessage = {
        id: Date.now().toString() + '-ai',
        text: res.data.result
          ? JSON.stringify(res.data.result, null, 2)
          : res.data.error || 'No response',
        sender: 'assistant',
        type: 'text',
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: Date.now().toString() + '-error',
        text: 'Error contacting assistant',
        sender: 'assistant',
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    }
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
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.container}>
        {messages.length === 0 ? (
          <View style={styles.welcomeContainer}>
            <Animated.View style={{transform: [{scale: pulseAnim}]}}>
              <Ionicons name="chatbubble-outline" size={64} color="#ffa500" />
            </Animated.View>
            <Text style={styles.welcomeText}>Ask me anything...</Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{paddingVertical: 16}}
          />
        )}
      </SafeAreaView>

      <View style={styles.inputRow}>
        <TouchableOpacity style={styles.iconButton} onPress={handleImagePick}>
          <Icon name="camera-alt" size={24} />
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fafafa'},
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    textAlign: 'center',
  },

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
});

export default ChatGPT;
