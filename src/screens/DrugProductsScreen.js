import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import {getDrugsByCategory} from '../utils/api';

const DrugProductsScreen = ({route, navigation}) => {
  const {categoryId, title} = route.params;

  const [loading, setLoading] = useState(true);
  const [drugs, setDrugs] = useState([]);

  const fetchDrugs = async () => {
    try {
      const data = await getDrugsByCategory(categoryId);
      setDrugs(data);
    } catch (e) {
      console.log('Error loading drugs:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    navigation.setOptions({title});
    fetchDrugs();
  }, []);

  const renderDrug = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DrugDetails', {drugId: item.id})}>
      {item.image ? (
        <Image source={{uri: item.image}} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Text style={{color: '#aaa'}}>No Image</Text>
        </View>
      )}

      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>KES {item.price}</Text>
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
        data={drugs}
        renderItem={renderDrug}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={{padding: 15}}
      />
    </View>
  );
};

export default DrugProductsScreen;

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
  image: {width: 70, height: 70, borderRadius: 10},
  noImage: {
    width: 70,
    height: 70,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  info: {flex: 1, marginLeft: 12},
  name: {fontSize: 16, fontWeight: '700', color: '#333'},
  price: {marginTop: 5, color: '#ffa500', fontWeight: '600'},
});
