import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const OrderSuccessScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Ionicons name="checkmark-circle" size={140} color="#28a745" />

      <Text style={styles.title}>Order Placed!</Text>
      <Text style={styles.subtitle}>
        Thank you for your purchase. Your order is being processed.
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('FeedStores')}>
        <Text style={styles.buttonText}>Continue Shopping</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryBtn}
        onPress={() => navigation.navigate('Farmer Home')}>
        <Text style={styles.secondaryText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 8,
    marginBottom: 25,
  },
  button: {
    backgroundColor: '#ffa500',
    padding: 15,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryBtn: {
    padding: 15,
  },
  secondaryText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
});
