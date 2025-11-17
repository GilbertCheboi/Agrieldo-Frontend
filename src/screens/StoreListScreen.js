import React, {useEffect, useState, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Picker} from '@react-native-picker/picker';
import {useNavigation} from '@react-navigation/native';
import {getFarms} from '../utils/api';

const BASE_URL = 'http://api.agrieldo.com/api';

const StoreListScreen = () => {
  const [stores, setStores] = useState([]);
  const [farms, setFarms] = useState([]);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const navigation = useNavigation();

  const fetchStores = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await axios.get(`${BASE_URL}/feed/stores/`, {
        headers: {Authorization: `Bearer ${token}`},
      });
      setStores(res.data);
    } catch (error) {
      console.log('❌ Error fetching stores:', error.response?.data || error);
      Alert.alert('Error', 'Could not load stores');
    } finally {
      setLoading(false);
    }
  };

  const fetchFarms = async () => {
    try {
      const userType = await AsyncStorage.getItem('user_type');

      // ─────────────────────────────────────
      // FARMER / OWNER → use imported getFarms()
      // ─────────────────────────────────────
      if (
        userType?.toLowerCase() === 'farmer' ||
        userType?.toLowerCase() === 'owner'
      ) {
        const data = await getFarms();
        console.log('🐄 Farmer farms fetched:', data);
        setFarms(data);
        return;
      }

      // ─────────────────────────────────────
      // STAFF → use original staff endpoint
      // ─────────────────────────────────────
      const token = await AsyncStorage.getItem('access_token');
      const res = await axios.get(`${BASE_URL}/farms/staff/farms/`, {
        headers: {Authorization: `Bearer ${token}`},
      });

      console.log('👨‍🌾 Staff farms fetched:', res.data);
      setFarms(res.data);
    } catch (error) {
      console.log('❌ Error fetching farms:', error.response?.data || error);
      Alert.alert('Error', 'Could not load farms');
    }
  };

  const handleAddStore = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Store name is required');
      return;
    }

    if (!selectedFarm) {
      Alert.alert('Error', 'Please select a farm');
      return;
    }

    try {
      const token = await AsyncStorage.getItem('access_token');
      const res = await axios.post(
        `${BASE_URL}/feed/stores/`,
        {name, description, farm: selectedFarm},
        {headers: {Authorization: `Bearer ${token}`}},
      );
      setStores(prev => [...prev, res.data]);
      setName('');
      setDescription('');
      setSelectedFarm(null);
      setModalVisible(false);
      Alert.alert('✅ Success', 'Store created successfully');
    } catch (error) {
      console.log('❌ Error creating store:', error.response?.data || error);
      Alert.alert('Error', 'Failed to create store');
    }
  };

  useEffect(() => {
    fetchStores();
    fetchFarms();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchStores();
    fetchFarms();
    setRefreshing(false);
  }, []);

  const renderStore = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate('FeedStoreScreen', {
          storeId: item.id,
          storeName: item.name,
        })
      }>
      <Text style={styles.storeName}>{item.name}</Text>
      {item.description ? (
        <Text style={styles.description}>{item.description}</Text>
      ) : null}
      <Text style={styles.farmText}>
        Farm: {item.farm_name || item.farm || 'N/A'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Stores</Text>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#ffa500"
          style={{marginTop: 40}}
        />
      ) : (
        <FlatList
          data={stores}
          keyExtractor={item => item.id.toString()}
          renderItem={renderStore}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={<Text style={styles.empty}>No stores yet</Text>}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Store Modal */}
      <Modal animationType="slide" visible={modalVisible} transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Add New Store</Text>

            <TextInput
              style={styles.input}
              placeholder="Store Name"
              placeholderTextColor="#777"
              value={name}
              onChangeText={setName}
            />

            <TextInput
              style={[styles.input, {height: 80}]}
              placeholder="Description"
              placeholderTextColor="#777"
              value={description}
              multiline
              onChangeText={setDescription}
            />

            <View style={styles.pickerContainer}>
              <Text style={styles.label}>Select Farm</Text>
              <Picker
                mode="dropdown" // ✅ ensures visibility on Android
                selectedValue={selectedFarm}
                onValueChange={setSelectedFarm}>
                <Picker.Item
                  label="Select a farm..."
                  value={null}
                  color="#333"
                />
                {farms.map(farm => (
                  <Picker.Item
                    key={farm.id}
                    label={farm.name}
                    value={farm.id}
                  />
                ))}
              </Picker>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleAddStore}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StoreListScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f4f6f8', padding: 16},
  header: {fontSize: 22, fontWeight: '700', marginBottom: 10, color: '#333'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    elevation: 3,
  },
  storeName: {fontSize: 18, fontWeight: '600', color: '#ffa500'},
  description: {fontSize: 14, color: '#555', marginTop: 5},
  farmText: {fontSize: 13, color: '#888', marginTop: 4},
  empty: {textAlign: 'center', color: '#888', marginTop: 40, fontSize: 16},
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#ffa500',
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '85%', // ✅ keep original modal size
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#000',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f9f9f9', // ✅ ensures visibility
    overflow: 'hidden', // prevents clipping
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
    marginLeft: 8,
    marginTop: 5,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  button: {paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8},
  cancelButton: {backgroundColor: '#999', marginRight: 10},
  saveButton: {backgroundColor: '#2e7d32'},
  buttonText: {color: '#fff', fontWeight: '600'},
});
