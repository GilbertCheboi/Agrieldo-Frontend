import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* INLINE API SETUP */
const API = axios.create({
  baseURL: 'http://api.agrieldo.com/api/',
  timeout: 10000,
});

const getAuthHeaders = async () => {
  const token = await AsyncStorage.getItem('access_token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json',
    },
  };
};

/* ---------------- API ENDPOINTS ---------------- */
const getCooperativeFarmers = async coopId => {
  const headers = await getAuthHeaders();
  const res = await API.get(`cooperatives/farmers/${coopId}/`, headers);
  return res.data;
};

const getMilkRecords = async (coopId, date) => {
  const headers = await getAuthHeaders();
  const res = await API.get(
    `cooperatives/milk/records/${coopId}/?date=${date}`,
    headers,
  );
  return res.data;
};

const createMilkRecord = async payload => {
  const headers = await getAuthHeaders();
  const res = await API.post(`cooperatives/milk/create/`, payload, headers);
  return res.data;
};

const updateMilkRecord = async (id, payload) => {
  const headers = await getAuthHeaders();
  const res = await API.patch(
    `cooperatives/milk/update/${id}/`,
    payload,
    headers,
  );
  return res.data;
};

const deleteMilkRecord = async id => {
  const headers = await getAuthHeaders();
  const res = await API.delete(`cooperatives/milk/delete/${id}/`, headers);
  return res.data;
};

/* ---------------- MAIN SCREEN ---------------- */
const ClerkMilkEntryScreen = ({route}) => {
  const coopId = route.params?.coopId;

  const [records, setRecords] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [filteredFarmers, setFilteredFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const [quantity, setQuantity] = useState('');
  const [newQuantity, setNewQuantity] = useState('');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [session, setSession] = useState('AM');

  const today = new Date().toISOString().split('T')[0];

  /* Load records */
  const loadRecords = async () => {
    try {
      const data = await getMilkRecords(coopId, today);
      setRecords(data);
    } catch (e) {
      console.log('Error loading records:', e);
    }
  };

  /* Load farmers */
  const loadFarmers = async () => {
    try {
      const data = await getCooperativeFarmers(coopId);
      setFarmers(data);
      setFilteredFarmers(data);
    } catch (e) {
      console.log('Error loading farmers:', e);
    }
  };

  useEffect(() => {
    setLoading(true);
    Promise.all([loadRecords(), loadFarmers()]).finally(() =>
      setLoading(false),
    );
  }, []);

  /* Pull to refresh */
  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadRecords(), loadFarmers()]);
    setRefreshing(false);
  };

  /* Search farmers */
  const searchFarmers = text => {
    setSearch(text);
    if (!text.trim()) return setFilteredFarmers(farmers);
    setFilteredFarmers(
      farmers.filter(
        f =>
          f.name.toLowerCase().includes(text.toLowerCase()) ||
          f.phone_number.includes(text),
      ),
    );
  };

  /* Add new milk */
  const addMilk = async () => {
    if (!selectedFarmer || !quantity.trim()) {
      Alert.alert('Error', 'Please select a farmer and enter quantity.');
      return;
    }

    try {
      await createMilkRecord({
        cooperative: coopId,
        farmer: selectedFarmer.id,
        date: today,
        session,
        quantity_liters: parseFloat(quantity),
      });

      setModalVisible(false);
      setQuantity('');
      setSelectedFarmer(null);
      loadRecords();
    } catch {
      Alert.alert('Error', 'Failed to add milk.');
    }
  };

  /* Open update modal */
  const openUpdateModal = record => {
    setSelectedRecord(record);
    setNewQuantity(String(record.quantity_liters));
    setUpdateModalVisible(true);
  };

  /* Save updated milk */
  const saveUpdatedMilk = async () => {
    try {
      await updateMilkRecord(selectedRecord.id, {
        cooperative: coopId,
        farmer: selectedRecord.farmer_id,
        date: selectedRecord.date,
        session: selectedRecord.session,
        quantity_liters: parseFloat(newQuantity),
      });

      setUpdateModalVisible(false);
      loadRecords();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Update failed.');
    }
  };

  const renderRecord = ({item}) => (
    <TouchableOpacity onLongPress={() => openUpdateModal(item)}>
      <View style={styles.recordCard}>
        <View>
          <Text style={styles.name}>{item.farmer_name}</Text>
          <Text style={styles.liters}>
            {item.session}: {item.quantity_liters} L
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity onPress={() => openUpdateModal(item)}>
            <Ionicons name="pencil" size={22} color="#ffa500" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => deleteMilkRecord(item.id)}>
            <Ionicons
              name="trash"
              size={22}
              color="red"
              style={{marginLeft: 12}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  /* ---------- UI ---------- */
  return (
    <View style={{flex: 1}}>
      <Text style={styles.title}>Today's Milk Records</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#ffa500" />
      ) : (
        <FlatList
          data={records}
          keyExtractor={i => String(i.id)}
          renderItem={renderRecord}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* ADD BUTTON */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>

      {/* ADD MODAL */}
      {/* ADD MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Add Milk Entry</Text>

                {/* Search Farmer */}
                <TextInput
                  placeholder="Search farmer..."
                  placeholderTextColor="#555"
                  value={search}
                  onChangeText={searchFarmers}
                  style={styles.input}
                />

                {/* Farmer List */}
                <FlatList
                  data={filteredFarmers}
                  keyExtractor={i => String(i.id)}
                  style={{maxHeight: 150}}
                  renderItem={({item}) => (
                    <TouchableOpacity
                      onPress={() => setSelectedFarmer(item)}
                      style={[
                        styles.farmerItem,
                        selectedFarmer?.id === item.id && styles.selectedFarmer,
                      ]}>
                      <Text style={{color: '#000', fontWeight: 'bold'}}>
                        {item.name}
                      </Text>
                      <Text style={{color: '#555'}}>{item.phone_number}</Text>
                    </TouchableOpacity>
                  )}
                />

                {/* Quantity Input */}
                <TextInput
                  placeholder="Liters"
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                />

                {/* AM / PM session */}
                <View style={styles.sessionRow}>
                  <TouchableOpacity
                    onPress={() => setSession('AM')}
                    style={[
                      styles.sessionBtn,
                      session === 'AM' && styles.selectedSession,
                    ]}>
                    <Text style={{color: session === 'AM' ? '#fff' : '#000'}}>
                      AM
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setSession('PM')}
                    style={[
                      styles.sessionBtn,
                      session === 'PM' && styles.selectedSession,
                    ]}>
                    <Text style={{color: session === 'PM' ? '#fff' : '#000'}}>
                      PM
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Actions */}
                <View style={styles.modalActions}>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <Text style={{color: '#000'}}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.saveBtn} onPress={addMilk}>
                    <Text style={{color: '#fff'}}>Save</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal visible={updateModalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setUpdateModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalBox}>
                <Text style={styles.modalTitle}>Update Quantity</Text>

                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  value={newQuantity}
                  onChangeText={setNewQuantity}
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    onPress={() => setUpdateModalVisible(false)}>
                    <Text>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.saveBtn}
                    onPress={saveUpdatedMilk}>
                    <Text style={{color: '#fff'}}>Update</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default ClerkMilkEntryScreen;

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    margin: 15,
    color: '#222', // darker → more visible
  },

  recordCard: {
    backgroundColor: '#ffffff',
    margin: 10,
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    elevation: 4,
    borderColor: '#ddd',
    borderWidth: 1,
  },

  name: {fontSize: 16, fontWeight: 'bold', color: '#222'},
  liters: {color: '#555', fontSize: 15},

  actions: {flexDirection: 'row'},

  fab: {
    position: 'absolute',
    right: 20,
    bottom: 25,
    color: '#ffa500',
    backgroundColor: '#333333',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  /* ---------- MODALS ---------- */
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 20,
  },

  modalBox: {
    backgroundColor: '#fff',
    padding: 22,
    borderRadius: 12,
    elevation: 6,
  },

  modalTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 10,
    color: '#222',
  },

  /* ---------- INPUTS ---------- */
  input: {
    borderWidth: 1.2,
    borderColor: '#bbb',
    padding: 12,
    borderRadius: 8,
    marginVertical: 10,
    color: '#222', // TEXT COLOR INSIDE INPUT
    backgroundColor: '#fafafa',
  },

  placeholderTextColor: {
    color: '#666',
  },

  modalActions: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  saveBtn: {
    backgroundColor: '#ffa500',
    padding: 12,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },

  /* ---------- FARMERS LIST ---------- */
  farmerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#fff',
  },

  farmerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },

  farmerPhone: {
    color: '#555',
    fontSize: 14,
  },

  selectedFarmer: {
    backgroundColor: '#ffe8cc',
  },

  /* Session Buttons */
  sessionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },

  sessionBtn: {
    padding: 12,
    width: '48%',
    alignItems: 'center',
    backgroundColor: '#efefef',
    borderRadius: 8,
  },

  selected: {
    backgroundColor: '#ffa500',
  },
});
