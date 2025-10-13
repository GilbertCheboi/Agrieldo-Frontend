import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; // ✅ for green ticks

const PremiumScreen = () => {
  const packages = [
    {
      id: '1',
      name: 'Silver Package',
      price: '500 KSH/month',
      description:
        'Access to detailed production reports and animal health alerts.',
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

  const handlePurchase = packageName => {
    alert(`You selected the ${packageName}. Proceed to payment.`);
    // Add payment integration here
  };

  const renderPackageCard = pkg => (
    <View key={pkg.id} style={styles.packageCard}>
      <Text style={styles.packageName}>{pkg.name}</Text>

      {/* Price with badge */}
      <View style={styles.priceBadge}>
        <Text style={styles.packagePrice}>{pkg.price}</Text>
      </View>
      <Text style={styles.packageDescription}>{pkg.description}</Text>

      {/* Features list with green ticks */}
      <View style={styles.featuresList}>
        {pkg.features.map((feature, index) => (
          <View key={index} style={styles.featureItem}>
            <Icon
              name="checkmark-circle"
              size={20}
              color="green"
              style={styles.featureIcon}
            />
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>

      {/* Purchase button */}
      <TouchableOpacity
        style={styles.purchaseButton}
        onPress={() => handlePurchase(pkg.name)}>
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
      {packages.map(pkg => renderPackageCard(pkg))}
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
    marginBottom: 20,
    textAlign: 'center',
  },
  packageCard: {
    width: '90%',
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 15,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  packageName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffa500',
    marginBottom: 8,
    textAlign: 'center',
  },
  priceBadge: {
    alignSelf: 'center',
    backgroundColor: '#000', // light orange background
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 8,
  },

  packagePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#02f73fec',
  },

  packageDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  featuresList: {
    marginBottom: 18,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  featureIcon: {
    marginRight: 8,
  },
  featureText: {
    fontSize: 15,
    color: '#444',
  },
  purchaseButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  purchaseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PremiumScreen;
