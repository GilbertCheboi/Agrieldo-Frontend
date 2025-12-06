import React, {useEffect, useState, useCallback, useRef, useMemo} from 'react';
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
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import MessageBubble from '../components/MessageBubble';
import ChatListScreen from './ChatListScreen';
import {getChatMessages, sendChatMessage, createChat} from '../utils/api';
import AgrieldoLogo from '../assets/logo.png'; // same logo (just used in header if you want)
import BillingGuard from '../components/BillingGuard';

const USER_INITIALS = 'GK'; // TODO: replace with dynamic initials from profile

export default function ChatScreen({navigation, route}) {
  const initialChatId = route?.params?.chatId || null;

  const [chatId, setChatId] = useState(initialChatId);
  const [messages, setMessages] = useState([]); // core messages only
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [attachedImage, setAttachedImage] = useState(null);

  const flatListRef = useRef(null);

  /* -------------------- HELPERS -------------------- */
  const now = () => new Date().toISOString();

  const formatDayLabel = dateObj => {
    const today = new Date();
    const d = new Date(dateObj);
    const oneDay = 24 * 60 * 60 * 1000;

    const diffDays = Math.floor(
      (today.setHours(0, 0, 0, 0) - d.setHours(0, 0, 0, 0)) / oneDay,
    );

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';

    return d.toLocaleDateString(undefined, {
      day: 'numeric',
      month: 'short',
      year: today.getFullYear() === d.getFullYear() ? undefined : 'numeric',
    });
  };

  const buildDisplayItems = msgs => {
    const items = [];
    let lastDateKey = null;

    msgs.forEach(m => {
      const d = m.timestamp ? new Date(m.timestamp) : new Date();
      const dateKey = d.toDateString();

      if (dateKey !== lastDateKey) {
        items.push({
          id: `sep-${dateKey}`,
          type: 'separator',
          label: formatDayLabel(d),
        });
        lastDateKey = dateKey;
      }

      items.push({...m, type: 'message'});
    });

    return items;
  };

  const displayItems = useMemo(() => buildDisplayItems(messages), [messages]);

  /* -------------------- INIT CHAT -------------------- */
  const initChat = useCallback(async id => {
    try {
      setLoading(true);
      let currentChatId = id;

      if (!currentChatId) {
        const newChat = await createChat();
        currentChatId = newChat.id;
        setChatId(newChat.id);
      }

      const data = await getChatMessages(currentChatId);
      setMessages(
        Array.isArray(data)
          ? data.map((m, index) => ({
              id: m.id?.toString() || `msg-${index}`,
              text: m.content,
              is_user: m.role === 'user',
              timestamp: m.created_at || m.timestamp || now(),
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

  /* -------------------- AUTO SCROLL -------------------- */
  useEffect(() => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({animated: true});
    }, 50);
  }, [messages]);

  /* -------------------- IMAGE PICKER -------------------- */
  const handlePickImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.didCancel) return;
      if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
        return;
      }
      const asset = response.assets && response.assets[0];
      if (asset) setAttachedImage(asset);
    });
  };

  /* -------------------- MIC BUTTON -------------------- */
  const handleMicPress = () => {
    setIsRecording(!isRecording);
    // You can later integrate speech-to-text and update `input`
  };

  /* -------------------- DELETE MESSAGE -------------------- */
  const handleDeleteMessage = id => {
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  /* -------------------- REGENERATE RESPONSE -------------------- */
  const handleRegenerate = async assistantId => {
    const index = messages.findIndex(m => m.id === assistantId);
    if (index === -1) return;

    // find previous user message (before this AI)
    const prevUser = [...messages]
      .slice(0, index)
      .reverse()
      .find(m => m.is_user);

    if (!prevUser) return;

    try {
      setIsTyping(true);
      setSending(true);

      const reply = await sendChatMessage(chatId, prevUser.text, null);
      const newText = reply?.reply || '...';

      setMessages(prev =>
        prev.map(m =>
          m.id === assistantId ? {...m, text: newText, timestamp: now()} : m,
        ),
      );
    } catch (err) {
      console.error('Regenerate error:', err);
    } finally {
      setIsTyping(false);
      setSending(false);
    }
  };

  /* -------------------- SEND MESSAGE -------------------- */
  const handleSend = async () => {
    if (!input.trim() && !attachedImage) return;

    const messageText = input.trim() || '[Image]';

    const userMsg = {
      id: `user-${Date.now()}`,
      text: messageText + (attachedImage ? '\n[Image Attached]' : ''),
      is_user: true,
      timestamp: now(),
    };

    setMessages(prev => [...prev, userMsg]);

    setInput('');
    const imageToSend = attachedImage;
    setAttachedImage(null);

    setSending(true);
    setIsTyping(true);

    try {
      const reply = await sendChatMessage(chatId, messageText, imageToSend);

      const assistantMsg = {
        id: `assistant-${Date.now()}`,
        text: reply?.reply || '...',
        is_user: false,
        timestamp: now(),
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
      setIsTyping(false);
    }
  };

  /* -------------------- CHAT SELECT -------------------- */
  const handleChatSelect = async id => {
    setShowHistory(false);
    setChatId(id);
    initChat(id);
  };

  /* -------------------- RENDER ITEM -------------------- */
  const renderItem = ({item}) => {
    if (item.type === 'separator') {
      return (
        <View style={styles.separatorContainer}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>{item.label}</Text>
          <View style={styles.separatorLine} />
        </View>
      );
    }

    return (
      <MessageBubble
        id={item.id}
        text={item.text}
        isUser={item.is_user}
        timestamp={item.timestamp}
        showAvatar={true}
        userInitials={USER_INITIALS}
        onDelete={handleDeleteMessage}
        onRegenerate={!item.is_user ? handleRegenerate : undefined}
      />
    );
  };

  const showSendButton = !!input.trim() || !!attachedImage;

  /* ==============================================================
     MAIN UI
     ============================================================== */
  return (
    <BillingGuard>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{flex: 1}}>
          {loading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#0a6847" />
            </View>
          ) : messages.length === 0 ? (
            <View style={styles.emptySpace} />
          ) : (
            <FlatList
              ref={flatListRef}
              data={displayItems}
              keyExtractor={(item, index) => item.id || index.toString()}
              renderItem={renderItem}
              contentContainerStyle={{padding: 16, paddingBottom: 150}}
            />
          )}
        </View>

        {/* Floating Input */}
        <View
          style={[
            styles.floatingInputWrapper,
            messages.length === 0 ? {bottom: '45%'} : {bottom: 10},
          ]}>
          {/* Typing indicator */}
          {isTyping && (
            <View style={styles.typingContainer}>
              <Text style={styles.typingText}>Agrieldo is thinking…</Text>
              <View style={styles.typingDots}>
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
                <View style={styles.typingDot} />
              </View>
            </View>
          )}

          {/* Image preview */}
          {attachedImage && (
            <View style={styles.imagePreviewContainer}>
              <Image
                source={{uri: attachedImage.uri}}
                style={styles.imagePreview}
              />
              <TouchableOpacity
                onPress={() => setAttachedImage(null)}
                style={styles.removeImageButton}>
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          )}

          <View
            className="floatingInputContainer"
            style={styles.floatingInputContainer}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={styles.iconButtonLeft}>
              <Ionicons name="image-outline" size={22} color="#ffa500" />
            </TouchableOpacity>

            <TextInput
              style={styles.floatingInput}
              value={input}
              onChangeText={setInput}
              placeholder="Ask Agrieldo AI…"
              placeholderTextColor="#888"
              multiline
            />

            {showSendButton ? (
              <TouchableOpacity
                onPress={handleSend}
                disabled={sending}
                style={[styles.floatingSendButton, sending && {opacity: 0.6}]}>
                <Ionicons name="send" size={20} color="#ffa500" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={handleMicPress}
                style={styles.iconButtonRight}>
                <Ionicons
                  name={isRecording ? 'mic' : 'mic-outline'}
                  size={20}
                  color="#ffa500"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* FAB for History */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => setShowHistory(true)}>
          <Ionicons name="time-outline" size={28} color="#ffa500" />
        </TouchableOpacity>

        {/* History Modal */}
        <Modal visible={showHistory} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setShowHistory(false)}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContainer}>
                  <ChatListScreen onSelectChat={handleChatSelect} />
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowHistory(false)}>
                    <Text style={styles.cancelText}>Close</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </KeyboardAvoidingView>
    </BillingGuard>
  );
}

/* ==============================================================
   STYLES
   ============================================================== */
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  centered: {flex: 1, alignItems: 'center', justifyContent: 'center'},
  emptySpace: {flex: 1},

  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  separatorText: {
    marginHorizontal: 8,
    fontSize: 12,
    color: '#999',
  },

  floatingInputWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
  },

  floatingInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 25,
    width: '90%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    shadowOffset: {width: 0, height: 2},
  },
  floatingInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingHorizontal: 8,
    maxHeight: 100,
  },
  iconButtonLeft: {padding: 6},
  iconButtonRight: {padding: 6},
  floatingSendButton: {
    marginLeft: 6,
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },

  typingContainer: {
    flexDirection: 'row',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 6,
    alignItems: 'center',
  },
  typingText: {fontSize: 12, color: '#555', marginRight: 6},
  typingDots: {flexDirection: 'row'},
  typingDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999',
    marginHorizontal: 2,
  },

  imagePreviewContainer: {marginBottom: 8, width: '90%', alignSelf: 'center'},
  imagePreview: {width: 80, height: 80, borderRadius: 10},
  removeImageButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#333',
    borderRadius: 10,
    padding: 3,
  },

  fab: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#333',
    padding: 12,
    borderRadius: 30,
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
    backgroundColor: '#333',
    padding: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  cancelText: {color: '#ffa500', textAlign: 'center', fontWeight: 'bold'},
});
