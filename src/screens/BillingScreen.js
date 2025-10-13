import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

const BillingScreen = () => {
  const [invoices, setInvoices] = useState([]);

  // Dummy data for invoices
  useEffect(() => {
    const fetchDummyInvoices = () => {
      const dummyInvoices = [
        {
          id: 1,
          description: 'Farm Equipment Purchase',
          amount: 50000,
          date: '2024-11-01',
        },
        {id: 2, description: 'Vet Services', amount: 15000, date: '2024-11-05'},
        {
          id: 3,
          description: 'Milk Delivery Subscription',
          amount: 20000,
          date: '2024-11-10',
        },
        {id: 4, description: 'Feed Supply', amount: 12000, date: '2024-11-12'},
        {
          id: 5,
          description: 'Farm Labor Costs',
          amount: 30000,
          date: '2024-11-15',
        },
      ];
      setInvoices(dummyInvoices);
    };

    fetchDummyInvoices();
  }, []);

  // Format currency in KES
  const formatKES = amount => `KES ${amount.toLocaleString()}`;

  return (
    <ScrollView style={styles.container}>
      {/* Header / Summary */}
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>Billing Overview</Text>
        <Text style={styles.headerSubtitle}>
          Recent invoices and transactions
        </Text>
      </View>

      <Text style={styles.heading}>Invoices</Text>
      {invoices.map(invoice => (
        <View key={invoice.id} style={styles.invoiceCard}>
          <View style={styles.invoiceRow}>
            <View style={styles.invoiceDetails}>
              <Text style={styles.invoiceDesc}>{invoice.description}</Text>
              <Text style={styles.invoiceDate}>{invoice.date}</Text>
            </View>
            <View style={styles.amountBadge}>
              <Text style={styles.amountText}>{formatKES(invoice.amount)}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f9',
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#ffa500',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    marginLeft: 4,
  },
  invoiceCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceDetails: {
    flex: 1,
  },
  invoiceDesc: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  invoiceDate: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  amountBadge: {
    backgroundColor: 'rgba(255,165,0,0.1)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  amountText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#ffa500',
  },
});

export default BillingScreen;
