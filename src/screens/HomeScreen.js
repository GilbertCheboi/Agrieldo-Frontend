// // File: src/screens/HomeScreen.js

// import React from 'react';
// import {View, Text, StyleSheet, ScrollView, Button} from 'react-native';
// import DashboardScreen from './DashboardScreen';
// import ChatGPT from './ChatGPT';
// const HomeScreen = ({navigation}) => {
//   return (
//     <ScrollView style={styles.container}>
//       <View style={styles.content}>
//         <DashboardScreen />
//         {/* <ChatGPT /> */}
//       </View>
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f5f5f5',
//   },
//   content: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: '600',
//     marginVertical: 10,
//   },
//   text: {
//     fontSize: 16,
//     marginBottom: 10,
//   },
//   buttonContainer: {
//     marginTop: 20,
//   },
// });

// export default HomeScreen;

import React from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import AccountScreen from './AccountScreen';

const HomeScreen = () => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}>
      <View style={styles.spacer} />
      <View style={styles.chatSection}>
        <AccountScreen />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-end', // pushes ChatGPT to bottom
  },
  spacer: {
    flex: 1,
  },
  chatSection: {
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
});

export default HomeScreen;
