import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {getFeedCategories} from '../utils/api';

const FeedCategoriesScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const res = await getFeedCategories();
      setCategories(res);
    } catch (err) {
      console.log('Category fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('FeedProducts', {
          categoryId: item.id,
          name: item.name,
        })
      }>
      <Text style={styles.name}>{item.name}</Text>
      {item.description ? (
        <Text style={styles.desc}>{item.description}</Text>
      ) : null}
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator size="large" color="#ffa500" />;

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={i => i.id.toString()}
      />
    </View>
  );
};

export default FeedCategoriesScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#fff'},
  card: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: '#fff5e6',
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#ffa500',
  },
  name: {fontSize: 18, fontWeight: '700', color: '#333'},
  desc: {fontSize: 14, marginTop: 6, color: '#666'},
});
