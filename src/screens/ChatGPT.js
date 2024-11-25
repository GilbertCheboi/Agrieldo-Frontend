import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';

const ChatGPT = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { id: Math.random().toString(), text: input, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);

      try {
        await sendRequest(); // Call the function to send the request
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setInput(''); // Clear the input field
      }
    }
  };

  const sendRequest = async (retryCount = 0) => {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: input }],
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const aiMessage = {
        id: Math.random().toString(),
        text: response.data.choices[0].message.content,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      if (error.response && error.response.status === 429 && retryCount < 3) {
        console.error('Rate limit exceeded, retrying...');
        setTimeout(() => sendRequest(retryCount + 1), 5000); // Retry after 5 seconds
      } else {
        console.error('Request failed after retries:', error);
        alert('Failed to send message. Please try again later.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={item.sender === 'user' ? styles.userMessage : styles.aiMessage}>
            {item.text}
          </Text>
        )}
      />
      <TextInput
        style={styles.input}
        value={input}
        onChangeText={setInput}
        placeholder="Ask a question..."
      />
      <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
    color: '#000', // Set text color to black for the input field

  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#ffa500',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
    color: 'white', // Added white text color for better visibility

  },
  aiMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  sendButton: {
    backgroundColor: '#ffa500',
    padding: 12,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default ChatGPT;
