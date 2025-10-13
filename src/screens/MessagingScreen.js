// // MessagingScreen.js
// import React, { useState } from 'react';
// import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

// const MessagingScreen = () => {
//   const [message, setMessage] = useState('');
//   const [messages, setMessages] = useState([]);

//   const handleSend = () => {
//     if (message.trim()) {
//       setMessages([...messages, { id: Date.now().toString(), text: message, sender: 'user' }]);
//       setMessage('');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Messaging</Text>
//       <FlatList
//         data={messages}
//         renderItem={({ item }) => (
//           <Text style={item.sender === 'user' ? styles.userMessage : styles.otherMessage}>
//             {item.text}
//           </Text>
//         )}
//         keyExtractor={(item) => item.id}
//         style={styles.messagesList}
//       />
//       <View style={styles.inputContainer}>
//         <TextInput
//           style={styles.input}
//           placeholder="Type your message"
//           value={message}
//           onChangeText={setMessage}
//           placeholderTextColor="#888"
//         />
//         <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
//           <Text style={styles.buttonText}>Send</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#f9f9f9',
//   },
//   title: {
//     fontSize: 24,
//     marginBottom: 16,
//     textAlign: 'center',
//     fontWeight: 'bold',
//   },
//   inputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ddd',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     width: '80%',
//     backgroundColor: '#fff',
//     color: '#000', // Make sure the text is visible
//   },
//   sendButton: {
//     backgroundColor: '#ffa500',
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   buttonText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   messagesList: {
//     marginBottom: 12,
//   },
//   userMessage: {
//     alignSelf: 'flex-end',
//     backgroundColor: '#ffa500',
//     padding: 12,
//     borderRadius: 10,
//     marginVertical: 5,
//     maxWidth: '80%',
//     color: '#000', // For better visibility of user text
//   },
//   otherMessage: {
//     alignSelf: 'flex-start',
//     backgroundColor: '#f2f2f2',
//     padding: 12,
//     borderRadius: 10,
//     marginVertical: 5,
//     maxWidth: '80%',
//     color: '#000',
//   },
// });

// export default MessagingScreen;

// File: MessagingScreen.js
import React from 'react';
import {View, StyleSheet} from 'react-native';
import ChatGPT from './ChatGPT';

const MessagingScreen = () => {
  return (
    <View style={styles.container}>
      <ChatGPT />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default MessagingScreen;
