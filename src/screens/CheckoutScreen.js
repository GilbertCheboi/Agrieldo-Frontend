import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {CartContext} from '../context/CartContext';
import {createUnifiedCheckout, unifiedMpesaPayment} from '../utils/api';

const CheckoutScreen = ({navigation}) => {
  const {cartItems, getCartTotal, clearCart} = useContext(CartContext);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const total = getCartTotal();

  const validatePhone = phone => {
    phone = phone.replace(/\s+/g, '');
    if (phone.startsWith('0')) {
      phone = '254' + phone.substring(1);
    }
    if (!phone.startsWith('2547') || phone.length !== 12) return null;
    return phone;
  };

  const handleUnifiedCheckout = async () => {
    if (!customerName || !customerPhone) {
      Alert.alert('Missing Info', 'Enter name and phone number.');
      return;
    }

    const phoneFormatted = validatePhone(customerPhone);
    if (!phoneFormatted) {
      Alert.alert('Invalid Number', 'Use Safaricom format 07XXXXXXXX');
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create unified checkout (backend will create feed + drug orders)
      const checkout = await createUnifiedCheckout(
        cartItems,
        customerName,
        phoneFormatted,
        total,
      );

      const unifiedOrderId = checkout.unified_order_id;

      // 2️⃣ Process Mpesa STK Push for full total
      await unifiedMpesaPayment({
        phone: phoneFormatted,
        amount: total,
        unified_order: unifiedOrderId,
      });

      // 3️⃣ Done
      clearCart();
      navigation.navigate('OrderSuccess');
    } catch (error) {
      console.log('Unified Checkout Error:', error.response?.data || error);
      Alert.alert('Error', 'Unable to complete checkout.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#ffa500" />
        <Text style={{marginTop: 10}}>Processing payment...</Text>
      </View>
    );
  }

  const feedItems = cartItems.filter(i => i.type === 'feed');
  const drugItems = cartItems.filter(i => i.type === 'drug');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={28} color="#333" />
          </TouchableOpacity>
          <Text style={styles.header}>Checkout</Text>
        </View>

        <View style={styles.summaryCard}>
          <Ionicons name="cart" size={30} color="#ffa500" />
          <View style={{marginLeft: 10}}>
            <Text style={styles.summaryTitle}>Order Summary</Text>
            <Text style={styles.summarySubtitle}>
              {cartItems.length} item(s)
            </Text>
          </View>
        </View>

        {feedItems.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>Feed Items</Text>
            {feedItems.map(item => (
              <View key={item.id} style={styles.itemCard}>
                <View style={{flex: 1}}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  KES {item.quantity * item.price}
                </Text>
              </View>
            ))}
          </>
        )}

        {drugItems.length > 0 && (
          <>
            <Text style={styles.sectionHeader}>Drug Items</Text>
            {drugItems.map(item => (
              <View key={item.id} style={styles.itemCard}>
                <View style={{flex: 1}}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemDetails}>Qty: {item.quantity}</Text>
                </View>
                <Text style={styles.itemPrice}>
                  KES {item.quantity * item.price}
                </Text>
              </View>
            ))}
          </>
        )}

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total Amount</Text>
          <Text style={styles.totalValue}>KES {total}</Text>
        </View>

        <Text style={styles.sectionHeader}>Customer Information</Text>

        <TextInput
          color="#333"
          placeholder="Full Name"
          placeholderTextColor="#777"
          value={customerName}
          onChangeText={setCustomerName}
          style={styles.input}
        />

        <TextInput
          color="#333"
          placeholder="Phone Number (e.g. 0700 123456)"
          placeholderTextColor="#777"
          value={customerPhone}
          onChangeText={setCustomerPhone}
          keyboardType="phone-pad"
          style={styles.input}
        />

        <TouchableOpacity style={styles.payBtn} onPress={handleUnifiedCheckout}>
          <Ionicons
            name="wallet"
            size={22}
            color="#fff"
            style={{marginRight: 10}}
          />
          <Text style={styles.payBtnText}>Pay with M-Pesa</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff', padding: 15},
  headerRow: {flexDirection: 'row', alignItems: 'center', marginBottom: 15},
  header: {fontSize: 26, fontWeight: '700', marginLeft: 10, color: '#333'},
  loadingScreen: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#fff7e6',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ffe0b3',
  },
  summaryTitle: {fontSize: 20, fontWeight: '700', color: '#333'},
  summarySubtitle: {fontSize: 14, color: '#777'},
  sectionHeader: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 10,
    color: '#333',
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  itemName: {fontSize: 16, fontWeight: '600', color: '#444'},
  itemDetails: {fontSize: 14, color: '#777'},
  itemPrice: {fontSize: 16, fontWeight: '700', color: '#ffa500'},
  totalCard: {
    marginTop: 20,
    backgroundColor: '#fff3d6',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ffd699',
  },
  totalLabel: {fontSize: 18, fontWeight: '700', color: '#333'},
  totalValue: {fontSize: 22, fontWeight: '900', color: '#ffa500'},
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginTop: 12,
  },
  payBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    padding: 16,
    borderRadius: 12,
    marginTop: 25,
    justifyContent: 'center',
  },
  payBtnText: {color: '#ffa500', fontSize: 18, fontWeight: '700'},
});
