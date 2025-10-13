// src/screens/MarketScreen.js
import React, {useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
} from 'react-native';

const MarketScreen = () => {
  // Dummy data with images
  const [animals] = useState([
    {
      id: '1',
      name: 'Bessie',
      species: 'Cow',
      price: '150, 000',
      image: require('../assets/fresian.jpeg'),
    },
    {
      id: '2',
      name: 'Dolly',
      species: 'Sheep',
      price: '6, 000',
      image: require('../assets/sheep.jpeg'),
    },
    {
      id: '3',
      name: 'Cluckers',
      species: 'Chicken',
      price: '1, 200',
      image: require('../assets/chicken.jpeg'),
    },
    {
      id: '4',
      name: 'Billy',
      species: 'Goat',
      price: '5, 000',
      image: require('../assets/goat.jpeg'),
    },
  ]);

  const handlePurchase = item => {
    Alert.alert(
      'Purchase Successful',
      `You selected ${item.name} (${item.species}). Price: Ksh ${item.price}`,
    );
  };

  const renderItem = ({item}) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.species}>{item.species}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>Ksh {item.price}</Text>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => handlePurchase(item)}>
            <Text style={styles.cartButtonText}>Purchase</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Agrieldo Market</Text>
      <FlatList
        data={animals}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default MarketScreen;

// 🎨 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 14,
    textAlign: 'center',
    color: '#ffa500',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: {width: 0, height: 2},
    elevation: 3,
  },
  image: {
    width: 100,
    height: 100,
  },
  cardContent: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  species: {
    fontSize: 14,
    color: '#666',
    marginVertical: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'green',
  },
  cartButton: {
    backgroundColor: '#ffa500',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
