import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import {listChats, createChat, deleteChat} from '../utils/api'; // ⬅️ Ensure deleteChat exists in utils/api.js

export default function ChatListScreen({onSelectChat}) {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch chats and auto-delete empty ones
  const fetchChats = async () => {
    setLoading(true);
    try {
      const data = await listChats();

      if (Array.isArray(data)) {
        // Filter out empty chats (no messages)
        const nonEmptyChats = [];
        for (const chat of data) {
          if (!chat.messages || chat.messages.length === 0) {
            // Delete chat if it has no messages
            try {
              await deleteChat(chat.id);
              console.log(`🗑️ Deleted empty chat: ${chat.id}`);
            } catch (err) {
              console.error(`Failed to delete empty chat ${chat.id}`, err);
            }
          } else {
            nonEmptyChats.push(chat);
          }
        }

        setChats(nonEmptyChats);
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error('Error fetching chats:', error);
      setChats([]);
    } finally {
      setLoading(false);
    }
  };

  // Create a new chat
  const handleNewChat = async () => {
    try {
      const newChat = await createChat();
      onSelectChat(newChat.id);
    } catch (error) {
      Alert.alert('Error', 'Unable to create a new chat.');
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  // Optional: manual refresh button
  const handleRefresh = () => {
    fetchChats();
  };

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
          <Text style={styles.newChatText}>+ New Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.refreshButton} onPress={handleRefresh}>
          <Text style={styles.refreshText}>↻ History</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          color="#0a6847"
          size="large"
          style={{marginTop: 20}}
        />
      ) : chats.length === 0 ? (
        <Text style={styles.empty}>No chat history yet</Text>
      ) : (
        <FlatList
          data={chats}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => onSelectChat(item.id)}>
              <View style={styles.chatInfo}>
                <Text style={styles.chatTitle}>
                  {item.title || 'Untitled Chat'}
                </Text>
                <Text style={styles.chatDate}>
                  {new Date(item.created_at).toLocaleString()}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  newChatButton: {
    backgroundColor: '#333333',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  newChatText: {color: '#ffa500', textAlign: 'center', fontSize: 16},
  refreshButton: {
    backgroundColor: '#e8e8e8',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  refreshText: {color: '#333', fontSize: 14, fontWeight: 'bold'},
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#e8f5e9',
    borderRadius: 10,
    marginBottom: 10,
  },
  chatInfo: {flex: 1},
  chatTitle: {fontSize: 14, fontWeight: 'bold', color: '#333333'},
  chatDate: {color: '#666', fontSize: 10, marginTop: 5},
  empty: {textAlign: 'center', color: '#888', marginTop: 20},
});
