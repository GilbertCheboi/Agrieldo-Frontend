import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {fetchVetRequests} from '../utils/api'; // ✅ Import function from utils

const VetListScreen = () => {
  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVets();
  }, []);

  const loadVets = async () => {
    try {
      const response = await fetchVetRequests(); // Uses API helper
      console.log('API Response:', response.data);
      setVets(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch vets:', error);
      Alert.alert('Error', 'Failed to fetch vets');
      setLoading(false);
    }
  };

  const renderVetItem = ({item}) => (
    <View style={styles.vetContainer}>
      <Text style={styles.vetName}>
        {item.user.first_name || item.user.last_name
          ? `${item.user.first_name} ${item.user.last_name}`
          : item.user.username}
      </Text>
      <Text style={styles.vetEmail}>{item.user.email}</Text>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <FlatList
      data={vets}
      renderItem={renderVetItem}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={styles.listContainer}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 20,
  },
  vetContainer: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  vetName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  vetEmail: {
    fontSize: 14,
    color: '#555',
  },
});

export default VetListScreen;
