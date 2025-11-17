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
import {getFeedProductDetail} from '../utils/api';
import {CartContext} from '../context/CartContext';

const FeedProductDetailScreen = ({route, navigation}) => {
  const {productId} = route.params;
  const {addToCart} = useContext(CartContext);

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const data = await getFeedProductDetail(productId);
      setProduct(data);
    } catch (err) {
      console.log('Product detail error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addItemToCart = () => {
    addToCart({
      id: 'feed-' + product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: qty,
      type: 'feed',
    });

    Alert.alert('Success', 'Item added to cart');
  };

  if (loading || !product)
    return (
      <ActivityIndicator size="large" color="#ffa500" style={{marginTop: 50}} />
    );

  return (
    <View style={{flex: 1}}>
      {/* 🔙 BACK BUTTON */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={26} color="#333" />
      </TouchableOpacity>

      <ScrollView style={styles.container}>
        {/* IMAGE */}
        {product.image && (
          <Image source={{uri: product.image}} style={styles.image} />
        )}

        {/* TITLE */}
        <Text style={styles.title}>{product.name}</Text>

        {/* PRICE */}
        <Text style={styles.price}>KES {product.price}</Text>

        {/* STOCK */}
        <Text style={styles.stock}>Stock: {product.quantity_in_stock}</Text>

        {/* QTY SELECTOR */}
        <View style={styles.qtyRow}>
          <TouchableOpacity
            onPress={() => setQty(Math.max(1, qty - 1))}
            style={styles.qtyBtn}>
            <Text style={styles.qtySign}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyText}>{qty}</Text>

          <TouchableOpacity
            onPress={() => setQty(qty + 1)}
            style={styles.qtyBtn}>
            <Text style={styles.qtySign}>+</Text>
          </TouchableOpacity>
        </View>

        {/* DESCRIPTION */}
        <Text style={styles.section}>Description</Text>
        <Text style={styles.desc}>
          {product.description || 'No description'}
        </Text>

        {/* ADD TO CART */}
        <TouchableOpacity style={styles.cartBtn} onPress={addItemToCart}>
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FeedProductDetailScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},

  /* 🔙 BACK BUTTON */
  backBtn: {
    position: 'absolute',
    top: 15,
    left: 10,
    zIndex: 20,
    padding: 8,
    backgroundColor: '#ffffffcc',
    borderRadius: 40,
    elevation: 3,
  },

  image: {width: '100%', height: 260},

  title: {fontSize: 26, fontWeight: '700', margin: 12, color: '#333'},

  price: {fontSize: 22, color: '#ffa500', marginLeft: 12},

  stock: {marginLeft: 12, color: '#555', marginVertical: 5},

  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginLeft: 12,
  },

  qtyBtn: {
    width: 38,
    height: 38,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },

  qtySign: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },

  qtyText: {fontSize: 18, color: '#333', marginHorizontal: 15},

  section: {fontSize: 18, fontWeight: '700', margin: 12},

  desc: {fontSize: 15, color: '#444', marginHorizontal: 12},

  cartBtn: {
    backgroundColor: '#333333',
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },

  cartText: {
    color: '#ffa500',
    fontWeight: '700',
    textAlign: 'center',
    fontSize: 17,
  },
});
