import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getFeedProducts} from '../utils/api';

const FeedProductsScreen = ({route, navigation}) => {
  const {categoryId, name} = route.params;
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await getFeedProducts(categoryId);
      setProducts(res);
    } catch (err) {
      console.log('Product fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('FeedDetails', {productId: item.id})}>
      {item.image ? (
        <Image source={{uri: item.image}} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Text>No Image</Text>
        </View>
      )}

      <View style={{marginLeft: 12}}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>KES {item.price}</Text>
        <Text style={styles.stock}>Stock: {item.quantity_in_stock}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );

  return (
    <View style={styles.container}>
      {/* 🔙 BACK BUTTON */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={26} color="#333" />
      </TouchableOpacity>

      <Text style={styles.header}>{name}</Text>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={i => i.id.toString()}
      />
    </View>
  );
};

export default FeedProductsScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},

  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},

  /* 🔙 BACK BUTTON */
  backBtn: {
    position: 'absolute',
    top: 15,
    left: 10,
    zIndex: 10,
    backgroundColor: '#ffffffcc',
    padding: 8,
    borderRadius: 50,
    elevation: 3,
  },

  header: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
    marginTop: 10, // spaced down so it doesn’t touch the back button
  },

  card: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  image: {width: 70, height: 70, borderRadius: 10},
  noImage: {
    width: 70,
    height: 70,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },

  name: {fontSize: 16, fontWeight: '700', color: '#333'},
  price: {color: '#ffa500', marginTop: 5, fontWeight: '600'},
  stock: {marginTop: 3, color: '#666'},
});
