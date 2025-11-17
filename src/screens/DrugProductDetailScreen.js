import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {getDrugDetails} from '../utils/api';
import {CartContext} from '../context/CartContext';

const DrugProductDetailScreen = ({route, navigation}) => {
  const {drugId} = route.params;
  const {addToCart} = useContext(CartContext);

  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  const loadDrug = async () => {
    try {
      const data = await getDrugDetails(drugId);
      setDrug(data);
    } catch (err) {
      console.log('Drug detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrug();
  }, []);

  const handleAddToCart = () => {
    addToCart({
      id: 'drug-' + drug.id,
      name: drug.name,
      image: drug.image,
      price: drug.price,
      type: 'drug',
      quantity: qty,
    });

    Alert.alert('Success', 'Item added to cart');
  };

  if (loading || !drug)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 BACK BUTTON */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={26} color="#333" />
      </TouchableOpacity>

      {/* Drug Image */}
      {drug.image ? (
        <Image source={{uri: drug.image}} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Ionicons name="image-outline" size={50} color="#ccc" />
        </View>
      )}

      {/* Name / Price */}
      <Text style={styles.title}>{drug.name}</Text>
      <Text style={styles.price}>KES {drug.price}</Text>

      {/* Quantity Selector */}
      <View style={styles.qtyRow}>
        <TouchableOpacity
          onPress={() => setQty(Math.max(1, qty - 1))}
          style={styles.qtyBtn}>
          <Text style={styles.qtySign}>-</Text>
        </TouchableOpacity>

        <Text style={styles.qtyText}>{qty}</Text>

        <TouchableOpacity onPress={() => setQty(qty + 1)} style={styles.qtyBtn}>
          <Text style={styles.qtySign}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Description */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.text}>{drug.description || 'No description'}</Text>

      {/* Instructions */}
      <Text style={styles.sectionTitle}>Usage Instructions</Text>
      <Text style={styles.text}>
        {drug.usage_instructions || 'No instructions provided'}
      </Text>

      {/* Add to Cart */}
      <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
        <Text style={styles.cartText}>Add to Cart</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default DrugProductDetailScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},

  /* 🔙 BACK BUTTON */
  backBtn: {
    position: 'absolute',
    top: 15,
    left: 15,
    zIndex: 10,
    backgroundColor: '#ffffffcc',
    padding: 8,
    borderRadius: 50,
    elevation: 3,
  },

  image: {width: '100%', height: 280, resizeMode: 'cover'},

  noImage: {
    width: '100%',
    height: 280,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 15,
    paddingHorizontal: 15,
  },

  price: {
    color: '#ffa500',
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 15,
    marginTop: 8,
  },

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 15,
  },

  qtyBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtySign: {fontSize: 22, fontWeight: '700', color: '#333'},

  qtyText: {fontSize: 20, color: '#333', marginHorizontal: 15},

  sectionTitle: {
    marginTop: 20,
    paddingHorizontal: 15,
    fontSize: 18,
    fontWeight: '700',
  },

  text: {
    paddingHorizontal: 15,
    marginTop: 8,
    color: '#555',
    lineHeight: 22,
  },

  cartBtn: {
    backgroundColor: '#ffa500',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 30,
    marginHorizontal: 15,
    marginBottom: 40,
  },

  cartText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
