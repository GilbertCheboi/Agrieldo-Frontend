// File: src/screens/InvoicesScreen.js

import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';
import { fetchInvoices } from '../api/billing';

const InvoicesScreen = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInvoices = async () => {
      try {
        const data = await fetchInvoices();
        setInvoices(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#0000ff" />;
  if (error) return <Text>Error: {error.message}</Text>;

  return (
    <View>
      <FlatList
        data={invoices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Invoice ID: {item.id}</Text>
            <Text>Amount: {item.amount}</Text>
            {/* Add other fields as necessary */}
          </View>
        )}
      />
    </View>
  );
};

export default InvoicesScreen;
