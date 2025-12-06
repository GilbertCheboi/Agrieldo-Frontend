import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getMarketListings} from '../utils/api';
import BillingGuard from '../components/BillingGuard';

const MarketListingsScreen = ({navigation}) => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadListings = async () => {
    try {
      const data = await getMarketListings();
      setListings(data);
    } catch (error) {
      console.log('Market load error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadListings();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );
  }

  if (!loading && listings.length === 0) {
    return (
      <FlatList
        data={[]}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Ionicons name="storefront-outline" size={60} color="#aaa" />
            <Text style={styles.emptyText}>No animals on the market yet</Text>
          </View>
        }
      />
    );
  }

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('MarketDetails', {
          listingId: item.id,
        })
      }>
      {/* Image */}
      {item.image ? (
        <Image source={{uri: item.image}} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Ionicons name="image-outline" size={40} color="#ccc" />
        </View>
      )}

      {/* Animal Name */}
      <Text style={styles.name}>{item.animal?.name}</Text>

      {/* Price */}
      <Text style={styles.price}>KES {item.price}</Text>

      {/* For Sale Tag */}
      <View style={styles.tag}>
        <Text style={styles.tagText}>FOR SALE</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <BillingGuard>
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </BillingGuard>
  );
};

export default MarketListingsScreen;

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#777',
  },
  listContainer: {
    padding: 10,
  },
  card: {
    backgroundColor: '#fff',
    width: '48%',
    margin: '1%',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    borderRadius: 8,
  },
  noImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#eee',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontWeight: '700',
    fontSize: 14,
    marginTop: 8,
    color: '#333',
  },
  price: {
    fontWeight: '700',
    fontSize: 16,
    color: '#ffa500',
    marginTop: 4,
  },
  tag: {
    backgroundColor: '#333333',
    paddingVertical: 4,
    paddingHorizontal: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  tagText: {
    color: '#ffa500',
    fontWeight: '700',
    fontSize: 10,
  },
});
