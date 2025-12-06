// BillingScreen.js

import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import {
  fetchBillingSummary,
  startBillingPayment,
  triggerMpesaStkPush,
} from '../utils/api';

const BillingScreen = () => {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const loadBilling = async () => {
    try {
      const data = await fetchBillingSummary();
      setBilling(data);
    } catch (error) {
      Alert.alert('Error', 'Unable to fetch billing summary.');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadBilling().finally(() => setRefreshing(false));
  };

  const handlePayNow = async () => {
    try {
      const paymentData = await startBillingPayment();
      const paymentId = paymentData?.payment_id;
      const amount = paymentData?.amount;

      if (!paymentId) {
        return Alert.alert('Error', 'Failed to start payment.');
      }

      await triggerMpesaStkPush(
        billing?.phone || '2547XXXXXXXX',
        amount,
        paymentId,
      );

      Alert.alert('STK Push Sent', 'Check your phone to complete payment.');
    } catch (error) {
      console.log(error);
      Alert.alert('Payment Error', 'Unable to process MPESA payment.');
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );
  }

  if (!billing) {
    return (
      <View style={styles.center}>
        <Text style={{color: '#333'}}>Billing information not available.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {/* HEADER */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Subscription Overview</Text>
        <Text style={styles.statusText}>
          Status:{' '}
          <Text
            style={[
              styles.statusValue,
              billing.status === 'active'
                ? styles.statusActive
                : billing.status === 'limited'
                ? styles.statusLimited
                : styles.statusSuspended,
            ]}>
            {billing.status?.toUpperCase()}
          </Text>
        </Text>
      </View>

      {/* FREE TRIAL */}
      {!billing.free_trial_used && (
        <View style={styles.freeTrialCard}>
          <Icon name="gift" size={30} color="#fff" />
          <Text style={styles.freeTrialText}>
            🎉 Free Trial Active — Enjoy Full Access!
          </Text>
        </View>
      )}

      {/* MAIN BILLING CARD */}
      <View style={styles.infoCard}>
        <View style={styles.row}>
          <Icon name="cow" size={22} color="#ffa500" />
          <Text style={styles.infoText}>Animals: {billing.animals}</Text>
        </View>

        <View style={styles.row}>
          <Icon name="cash" size={22} color="#ffa500" />
          <Text style={styles.infoText}>
            Monthly Fee: KES {billing.monthly_fee}
          </Text>
        </View>

        <View style={styles.row}>
          <Icon name="clock-alert" size={22} color="#ffa500" />
          <Text style={styles.infoText}>
            Unpaid Months: {billing.unpaid_months}
          </Text>
        </View>

        <View style={styles.separator} />

        <View style={styles.row}>
          <Icon name="wallet-outline" size={24} color="#ff6600" />
          <Text style={styles.totalText}>
            Total Due:{' '}
            <Text style={styles.totalValue}>
              KES {billing.outstanding_balance}
            </Text>
          </Text>
        </View>

        <Text style={styles.smallText}>
          Next Billing Date: {billing.next_billing_date || '—'}
        </Text>
      </View>

      {/* PAY BUTTON */}
      {billing.status !== 'active' && (
        <TouchableOpacity onPress={handlePayNow} style={styles.payBtn}>
          <Icon name="cellphone-text" size={22} color="#fff" />
          <Text style={styles.payBtnText}>Pay with M-PESA</Text>
        </TouchableOpacity>
      )}

      {/* MESSAGES */}
      {billing.status === 'limited' && (
        <Text style={styles.limitedText}>
          ⚠ Your access is limited. Complete payment to restore full access.
        </Text>
      )}

      {billing.status === 'suspended' && (
        <Text style={styles.suspendedText}>
          ❌ Subscription suspended. Payment required to continue using
          Agrieldo.
        </Text>
      )}

      <View style={{height: 40}} />
    </ScrollView>
  );
};

// ----------------------------
// MODERN STYLES
// ----------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f4f7',
    padding: 16,
  },

  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},

  // Header
  headerCard: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 16,
    elevation: 3,
    shadowColor: '#000',
    marginBottom: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginBottom: 6,
  },
  statusText: {fontSize: 16, color: '#444'},
  statusValue: {fontWeight: '700'},
  statusActive: {color: 'green'},
  statusLimited: {color: '#ff9900'},
  statusSuspended: {color: 'red'},

  // Free trial box
  freeTrialCard: {
    backgroundColor: '#34a853',
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: 'center',
  },
  freeTrialText: {color: '#fff', fontWeight: '600', marginTop: 8},

  // Main content card
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#999',
    marginBottom: 20,
  },
  row: {flexDirection: 'row', alignItems: 'center', marginBottom: 12},
  infoText: {marginLeft: 10, fontSize: 16, color: '#333'},
  totalText: {marginLeft: 10, fontSize: 18, fontWeight: '700'},
  totalValue: {color: '#ff6600'},
  smallText: {color: '#666', marginTop: 8, fontSize: 13},
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 12,
  },

  // Pay button
  payBtn: {
    flexDirection: 'row',
    backgroundColor: '#0B9444',
    padding: 16,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  payBtnText: {color: '#fff', fontSize: 17, fontWeight: '700'},

  // Status texts
  limitedText: {
    marginTop: 15,
    color: '#ff9900',
    fontWeight: '600',
    textAlign: 'center',
  },
  suspendedText: {
    marginTop: 15,
    color: 'red',
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default BillingScreen;
