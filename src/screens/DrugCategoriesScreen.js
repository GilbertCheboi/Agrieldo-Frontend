import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getDrugCategories} from '../utils/api';

const DrugCategoriesScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const data = await getDrugCategories();
      setCategories(data);
    } catch (e) {
      console.log('Error loading categories:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategory = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('DrugProducts', {
          categoryId: item.id,
          title: item.name,
        })
      }>
      <View style={styles.iconContainer}>
        <Ionicons name="medkit-outline" size={28} color="#ffa500" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description ? (
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  if (loading)
    return (
      <View style={styles.loader}>
        <ActivityIndicator color="#ffa500" size="large" />
      </View>
    );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{padding: 15}}
      />
    </View>
  );
};

export default DrugCategoriesScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  card: {
    flexDirection: 'row',
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 55,
    height: 55,
    borderRadius: 10,
    backgroundColor: '#ffe8cc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  info: {flex: 1},
  name: {fontSize: 18, fontWeight: '700', color: '#333'},
  description: {marginTop: 5, color: '#777', fontSize: 14},
});
