import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const BillingScreen = () => {
  const [invoices, setInvoices] = useState([]);

  // Dummy data for invoices
  useEffect(() => {
    const fetchDummyInvoices = () => {
      const dummyInvoices = [
        { id: 1, description: 'Farm Equipment Purchase', amount: '500 USD', date: '2024-11-01' },
        { id: 2, description: 'Vet Services', amount: '150 USD', date: '2024-11-05' },
        { id: 3, description: 'Milk Delivery Subscription', amount: '200 USD', date: '2024-11-10' },
        { id: 4, description: 'Feed Supply', amount: '120 USD', date: '2024-11-12' },
        { id: 5, description: 'Farm Labor Costs', amount: '300 USD', date: '2024-11-15' }
      ];
      setInvoices(dummyInvoices);
    };

    fetchDummyInvoices();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Invoices</Text>
      {invoices.map(invoice => (
        <View key={invoice.id} style={styles.invoiceCard}>
          <Text style={styles.invoiceText}>
            <Text style={styles.boldText}>Description:</Text> {invoice.description}
          </Text>
          <Text style={styles.invoiceText}>
            <Text style={styles.boldText}>Amount:</Text> {invoice.amount}
          </Text>
          <Text style={styles.invoiceText}>
            <Text style={styles.boldText}>Date:</Text> {invoice.date}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  invoiceCard: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  invoiceText: {
    fontSize: 18,
    color: '#444',
    marginBottom: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#ffa500', // Using your specified color for emphasis
  },
});

export default BillingScreen;
