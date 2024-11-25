import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, FlatList, TouchableOpacity, Alert } from 'react-native';

const StoreScreen = () => {
  // Dummy product data
  const products = [
    { id: '1', name: 'Veterinary Medicine A', price: 20.99, description: 'Used for treating common illnesses in livestock.' },
    { id: '2', name: 'Flea and Tick Prevention', price: 15.50, description: 'Effective flea and tick prevention for dogs and cats.' },
    { id: '3', name: 'Nutritional Feed B', price: 30.00, description: 'High-quality feed for cattle to boost milk production.' },
    { id: '4', name: 'Medical Supplies Kit', price: 50.00, description: 'Essential medical supplies for veterinary emergencies.' },
    { id: '5', name: 'Vaccine Pack', price: 45.00, description: 'Includes various vaccines for poultry.' },
  ];

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => handleProductPress(item)}
    >
      <Text style={styles.productTitle}>{item.name}</Text>
      <Text style={styles.productDescription}>Description: {item.description}</Text>
      <Text style={styles.productPrice}>Price: ${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );

  const handleProductPress = (product) => {
    Alert.alert('Product Selected', `You selected ${product.name}.`);
    // Add functionality for product details or purchasing
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Drug Store</Text>
      <Text style={styles.welcomeText}>Welcome to the store page.</Text>
      {/* Updated View Products button */}
      <TouchableOpacity style={styles.viewProductsButton} onPress={() => {/* Add functionality to view products */}}>
        <Text style={styles.viewProductsButtonText}>View Products</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f4f9',  // Light gray background for the entire screen
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',  // Dark text for better readability
    marginBottom: 16,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 18,
    color: '#555',  // Lighter gray text for general info
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    marginTop: 20,
  },
  productContainer: {
    padding: 12,
    marginVertical: 8,
    backgroundColor: '#ffffff',  // White background for product items
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',  // Light border color
    shadowColor: '#000',  // Add a subtle shadow to give depth
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',  // Dark text for product title
  },
  productDescription: {
    fontSize: 14,
    color: '#666',  // Lighter gray text for description
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c8e4e',  // Greenish color for price to highlight it
  },
  // New style for View Products button
  viewProductsButton: {
    backgroundColor: '#ffa500',  // Yellowish color for the button
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewProductsButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',  // White text for the button
  },
});

export default StoreScreen;
