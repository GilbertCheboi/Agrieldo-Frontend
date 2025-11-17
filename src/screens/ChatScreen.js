import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Text,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import MessageBubble from '../components/MessageBubble';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ChatListScreen from './ChatListScreen';
import {getChatMessages, sendChatMessage, createChat} from '../utils/api';

export default function ChatScreen({navigation, route}) {
  const initialChatId = route?.params?.chatId || null;
  const [chatId, setChatId] = useState(initialChatId);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const initChat = useCallback(async id => {
    try {
      setLoading(true);
      let currentChatId = id;

      if (!currentChatId) {
        const newChat = await createChat();
        currentChatId = newChat.id;
        setChatId(newChat.id);
      } else {
        setChatId(currentChatId);
      }

      const data = await getChatMessages(currentChatId);
      console.log('Fetched messages for chat', currentChatId, data);

      // Normalize messages
      setMessages(
        Array.isArray(data)
          ? data.map(m => ({
              text: m.content,
              is_user: m.role === 'user',
            }))
          : [],
      );
    } catch (err) {
      console.error('Error initializing chat:', err);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initChat(initialChatId);
  }, [initialChatId, initChat]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = {text: input, is_user: true};
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setSending(true);
    try {
      const reply = await sendChatMessage(chatId, input);
      setMessages(prev => [...prev, {text: reply.reply, is_user: false}]);
    } catch (error) {
      console.error('Send message error:', error);
    } finally {
      setSending(false);
    }
  };

  const handleChatSelect = async selectedChatId => {
    setShowHistory(false);
    setChatId(selectedChatId);
    initChat(selectedChatId);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={{flex: 1}}>
        {loading ? (
          <ActivityIndicator size="large" color="#0a6847" />
        ) : messages.length === 0 ? (
          // 👇 WELCOME MESSAGE UI
          <View style={styles.welcomeContainer}>
            <Ionicons name="chatbubbles-outline" size={60} color="#ffa500" />
            <Text style={styles.welcomeTitle}>Welcome to Agrieldo AI</Text>
            <Text style={styles.welcomeSubtitle}>
              Ask me anything — AI-powered insights to guide your farm
              decisions.
            </Text>
          </View>
        ) : (
          <FlatList
            data={messages}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) => (
              <MessageBubble text={item.text} isUser={item.is_user} />
            )}
            contentContainerStyle={{padding: 16}}
          />
        )}
      </View>

      {/* Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Ask Agrieldo AI..."
          placeholderTextColor="#888"
        />
        <TouchableOpacity
          onPress={handleSend}
          style={[styles.sendButton, sending && {opacity: 0.6}]}
          disabled={sending}>
          <Ionicons name="send" size={20} color="#ffa500" />
        </TouchableOpacity>
      </View>

      {/* FAB for History */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowHistory(true)}>
        <Ionicons name="time-outline" size={28} color="#ffa500" />
      </TouchableOpacity>

      {/* Half-screen Modal */}
      <Modal
        visible={showHistory}
        transparent
        animationType="slide"
        onRequestClose={() => setShowHistory(false)}>
        <TouchableWithoutFeedback onPress={() => setShowHistory(false)}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContainer}>
                <ChatListScreen
                  onSelectChat={handleChatSelect}
                  onClose={() => setShowHistory(false)}
                />
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setShowHistory(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal> 
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  welcomeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0a6847',
    marginTop: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  welcomeHint: {
    marginTop: 20,
    fontSize: 14,
    color: '#777',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333333', // 👈 Add this
  },

  sendButton: {
    marginLeft: 10,
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 30,
  },
  fab: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#333333',
    borderRadius: 30,
    padding: 12,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContainer: {
    height: '60%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  cancelButton: {
    backgroundColor: '#333333',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
    color: '#333',
  },
  cancelText: {
    textAlign: 'center',
    color: '#ffa500',
    fontWeight: 'bold',
  },
});
