import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const PremiumScreen = () => {
  const packages = [
    {
      id: '1',
      name: 'Silver Package',
      price: '500 KSH/month',
      description: 'Access to detailed production reports and animal health alerts.',
      features: [
        'Detailed Production Reports',
        'Animal Health Alerts',
        'Basic Support',
      ],
    },
    {
      id: '2',
      name: 'Gold Package',
      price: '1000 KSH/month',
      description: 'Includes all Silver features plus expert consultations.',
      features: [
        'All Silver Features',
        'Expert Consultations',
        'Farm Financial Analysis',
      ],
    },
    {
      id: '3',
      name: 'Platinum Package',
      price: '2000 KSH/month',
      description:
        'All-inclusive package with priority support and exclusive farming tools.',
      features: [
        'All Gold Features',
        'Priority Support',
        'Exclusive Farming Tools',
        'Advanced Market Analytics',
      ],
    },
  ];

  const handlePurchase = (packageName) => {
    alert(`You selected the ${packageName}. Proceed to payment.`);
    // Add payment functionality here
  };

  const renderPackageCard = (pkg) => (
    <View key={pkg.id} style={styles.packageCard}>
      <Text style={styles.packageName}>{pkg.name}</Text>
      <Text style={styles.packagePrice}>{pkg.price}</Text>
      <Text style={styles.packageDescription}>{pkg.description}</Text>
      <View style={styles.featuresList}>
        {pkg.features.map((feature, index) => (
          <Text key={index} style={styles.featureItem}>
            - {feature}
          </Text>
        ))}
      </View>
      <TouchableOpacity
        style={styles.purchaseButton}
        onPress={() => handlePurchase(pkg.name)}
      >
        <Text style={styles.purchaseButtonText}>Purchase</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Premium Packages</Text>
      <Text style={styles.subtitle}>
        Unlock exclusive features to improve your farming experience.
      </Text>
      {packages.map((pkg) => renderPackageCard(pkg))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f4f9',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
    textAlign: 'center',
  },
  packageCard: {
    width: '90%',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffa500',
    marginBottom: 8,
    textAlign: 'center',
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  packageDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 10,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 14,
    color: '#555',
    marginVertical: 2,
  },
  purchaseButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PremiumScreen;
