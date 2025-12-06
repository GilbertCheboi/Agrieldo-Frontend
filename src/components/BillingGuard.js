import React, {useContext} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {BillingContext} from '../context/BillingContext';
import {useNavigation} from '@react-navigation/native';

const BillingGuard = ({children}) => {
  const {billing} = useContext(BillingContext);
  const navigation = useNavigation();

  if (!billing) return null;

  if (billing.status === 'active') {
    return children;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>
        {billing.status === 'limited'
          ? 'Your account is in LIMITED mode due to unpaid months.'
          : 'Your subscription is SUSPENDED. Please pay to resume full access.'}
      </Text>

      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('Billing')}>
        <Text style={styles.btnTxt}>Pay Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {padding: 20, alignItems: 'center'},
  message: {fontSize: 16, marginBottom: 20, textAlign: 'center', color: '#333'},
  btn: {
    backgroundColor: '#ffa500',
    padding: 12,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  btnTxt: {color: '#fff', fontWeight: 'bold'},
});

export default BillingGuard;
