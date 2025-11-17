import React, {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
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
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import styles from '../assets/styles/AccountScreenStyles.js';
import EditFarmModal from './modals/EditFarmModal.js';
import AddFarmModal from './modals/AddFarmModal.js';
import {deleteFarm} from '../utils/api.js';

const AccountScreen = () => {
  const navigation = useNavigation();

  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSettingsIndex, setActiveSettingsIndex] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);

  const fetchFarms = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(
        'http://api.agrieldo.com/api/farms/get_farms',
        {headers: {Authorization: `Bearer ${token}`}},
      );
      setFarms(response.data);
    } catch (error) {
      console.error('Error fetching farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      await deleteFarm(id);
      Alert.alert('✅ Success', 'Farm deleted successfully');
      fetchFarms();
    } catch (err) {
      console.error('Delete failed:', err);
      Alert.alert('Error', 'Failed to delete farm. Please try again.');
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );
  }

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{flexGrow: 1, paddingVertical: 10}}>
        {farms.length === 0 ? (
          <View style={localStyles.emptyContainer}>
            <Icon name="alert-circle" size={60} color="#ffa500" />
            <Text style={localStyles.emptyText}>
              You don’t have any farms yet.
            </Text>
            <Text style={localStyles.emptySubText}>
              Tap the plus button in the bottom-right corner to add your first
              farm.
            </Text>
          </View>
        ) : (
          farms.map((farm, index) => (
            <TouchableOpacity
              key={farm.id || index}
              style={localStyles.cardContainer}
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('FarmDashboard', {farmId: farm.id})
              }>
              {/* Farm Image */}
              <Image
                source={{
                  uri: farm.image?.startsWith('http')
                    ? farm.image
                    : `http://api.agrieldo.com${farm.image}`,
                }}
                style={localStyles.farmImage}
                resizeMode="cover"
                defaultSource={require('../assets/vinny.png')}
                onError={() => console.log('Image failed to load:', farm.image)}
              />

              {/* Farm Details */}
              <View style={localStyles.farmInfo}>
                <View style={localStyles.headerRow}>
                  <Text style={localStyles.farmName}>
                    {farm.name || `Farm ${index + 1}`}
                  </Text>
                  <TouchableOpacity
                    onPress={e => {
                      e.stopPropagation();
                      setActiveSettingsIndex(
                        activeSettingsIndex === index ? null : index,
                      );
                    }}>
                    <Icon name="more-vertical" size={22} color="#555" />
                  </TouchableOpacity>
                </View>

                <Text style={localStyles.farmType}>{farm.type || 'Dairy'}</Text>

                <View style={localStyles.locationRow}>
                  <Icon name="map-pin" size={14} color="#ffa500" />
                  <Text style={localStyles.farmLocation}>
                    {farm.location || 'No location set'}
                  </Text>
                </View>

                <Text style={localStyles.lastUpdated}>
                  {farm.updated_at
                    ? `Updated ${new Date(
                        farm.updated_at,
                      ).toLocaleDateString()}`
                    : 'No updates yet'}
                </Text>
              </View>

              {/* Settings Dropdown */}
              {activeSettingsIndex === index && (
                <View style={localStyles.settingsModal}>
                  <View
                    style={[localStyles.statusBadge, localStyles.statusActive]}>
                    <Text style={localStyles.statusText}>Active</Text>
                  </View>

                  <TouchableOpacity
                    style={localStyles.modalItem}
                    onPress={() => {
                      fetchFarms();
                      setActiveSettingsIndex(null);
                    }}>
                    <Icon name="refresh-ccw" size={18} color="#333" />
                    <Text style={localStyles.modalText}>Refresh</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={localStyles.modalItem}
                    onPress={() => {
                      setSelectedFarm(farm);
                      setEditModalVisible(true);
                      setActiveSettingsIndex(null);
                    }}>
                    <Icon name="edit" size={18} color="#333" />
                    <Text style={localStyles.modalText}>Edit Farm</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={localStyles.modalItem}
                    onPress={() => {
                      setActiveSettingsIndex(null);
                      navigation.navigate('FarmTeam', {farmId: farm.id});
                    }}>
                    <Icon name="users" size={18} color="#333" />
                    <Text style={localStyles.modalText}>Manage Team</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={localStyles.modalItem}
                    onPress={() => {
                      Alert.alert(
                        'Confirm Delete',
                        `Are you sure you want to delete ${farm.name}?`,
                        [
                          {text: 'Cancel', style: 'cancel'},
                          {
                            text: 'Delete',
                            style: 'destructive',
                            onPress: () => handleDelete(farm.id),
                          },
                        ],
                      );
                      setActiveSettingsIndex(null);
                    }}>
                    <Icon name="trash" size={18} color="red" />
                    <Text style={[localStyles.modalText, {color: 'red'}]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Floating + Button */}
      <TouchableOpacity
        style={localStyles.fab}
        onPress={() => setAddModalVisible(true)}>
        <Icon name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Modals */}
      <EditFarmModal
        visible={editModalVisible}
        farm={selectedFarm}
        onClose={() => setEditModalVisible(false)}
        onUpdated={fetchFarms}
      />
      <AddFarmModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSave={newFarm => {
          setFarms(prev => [newFarm, ...prev]);
          setAddModalVisible(false);
        }}
      />
    </>
  );
};

export default AccountScreen;

const localStyles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 12,
    marginVertical: 6,
    borderRadius: 14,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  farmImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    marginRight: 12,
    backgroundColor: '#f0f0f0',
  },
  farmInfo: {flex: 1},
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  farmName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  farmType: {
    fontSize: 14,
    color: '#ffa500',
    fontWeight: '600',
    marginTop: 2,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  farmLocation: {
    fontSize: 13,
    color: '#666',
    marginLeft: 4,
  },
  lastUpdated: {
    fontSize: 12,
    color: '#999',
    marginTop: 6,
  },

  settingsModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    position: 'absolute',
    top: 8,
    right: 10,
    zIndex: 10,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    width: 170,
  },
  modalItem: {flexDirection: 'row', alignItems: 'center', paddingVertical: 6},
  modalText: {marginLeft: 8, fontSize: 14, color: '#333'},
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#d4edda',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  statusActive: {backgroundColor: '#d4edda'},
  statusText: {fontSize: 12, color: '#155724'},

  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ffa500',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
});
