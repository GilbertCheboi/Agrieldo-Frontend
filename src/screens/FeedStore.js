import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import styles from '../assets/styles/StoreScreenStyles';

const FeedStore = () => {
  const products = [
    {
      id: '1',
      name: 'Veterinary Medicine A',
      price: 20.99,
      description: 'Treats common livestock illnesses.',
      image:
        'https://media.istockphoto.com/id/2215337200/photo/liquid-amoxicillin-bottle-for-children.webp?a=1&b=1&s=612x612&w=0&k=20&c=fgyMtC3N37m2JHqSGL6S0xoKIfrZWMnKNvWWGDFuq6Q=',
    },
    {
      id: '2',
      name: 'Flea and Tick Prevention',
      price: 15.5,
      description: 'Prevents fleas and ticks in pets.',
      image:
        'https://via.placeholder.com/150/FF7F50/ffffff?text=Flea+Prevention',
    },
    {
      id: '3',
      name: 'Nutritional Feed B',
      price: 30.0,
      description: 'Boosts cattle milk production.',
      image: 'https://via.placeholder.com/150/32CD32/ffffff?text=Feed+B',
    },
    {
      id: '4',
      name: 'Medical Supplies Kit',
      price: 50.0,
      description: 'Essential veterinary supplies.',
      image: 'https://via.placeholder.com/150/4682B4/ffffff?text=Supplies+Kit',
    },
    {
      id: '5',
      name: 'Vaccine Pack',
      price: 45.0,
      description: 'Includes poultry vaccines.',
      image: 'https://via.placeholder.com/150/DC143C/ffffff?text=Vaccine+Pack',
    },
  ];

  const handleAddToCart = item => {
    Alert.alert('Added to Cart', `${item.name} added to your cart.`);
  };

  const renderProductItem = ({item}) => (
    <View style={styles.card}>
      <Image source={{uri: item.image}} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.bottomRow}>
          <Text style={styles.price}>Ksh {item.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => handleAddToCart(item)}>
            <Text style={styles.cartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProductItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default FeedStore;
