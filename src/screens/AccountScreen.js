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
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Feather';
import styles from '../assets/styles/AccountScreenStyles.js';
import EditModal from './modals/EditModal'; // Make sure EditModal.js is in the same folder

const AccountScreen = () => {
  const navigation = useNavigation();

  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSettingsIndex, setActiveSettingsIndex] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);

  const fetchFarms = async () => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      const response = await axios.get(
        'http://192.168.100.4:8000/api/farms/get_farms',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setFarms(response.data);
    } catch (error) {
      console.error('Error fetching farms:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateFarm = async updatedFarm => {
    try {
      const token = await AsyncStorage.getItem('access_token');
      await axios.patch(
        `http://192.168.100.4:8000/api/farms/${updatedFarm.id}/`,
        updatedFarm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchFarms(); // Refresh the list
    } catch (error) {
      console.error('Error updating farm:', error);
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
      <ScrollView style={styles.container}>
        {farms.map((farm, index) => (
          <TouchableOpacity
            key={farm.id || index}
            style={styles.cameraContainer}
            activeOpacity={0.9}
            onPress={() =>
              navigation.navigate('FarmDashboard', {farmId: farm.id})
            }>
            {/* Title + Settings */}
            <View style={styles.nameAndStatus}>
              <Text style={styles.cameraTitle}>
                {farm.name || `Farm ${index + 1}`}
              </Text>

              {/* Prevent settings icon from triggering parent onPress */}
              <TouchableOpacity
                onPress={e => {
                  e.stopPropagation(); // ✅ prevent parent touch
                  setActiveSettingsIndex(
                    activeSettingsIndex === index ? null : index,
                  );
                }}>
                <Icon name="settings" size={22} color="#ffa500" />
              </TouchableOpacity>
            </View>

            {/* Image Feed */}
            <View style={styles.videoContainer}>
              <Image
                source={require('../assets/vinny.png')}
                style={styles.videoFeed}
              />
              <View style={styles.videoTextDisplay}>
                <Text style={styles.videoText}>
                  {farm.location || 'Farm Live Feed'}
                </Text>
                <Text style={styles.lastUpdatedText}>
                  Update: 2 minutes ago
                </Text>
              </View>
            </View>

            {/* Settings Modal */}
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
                    alert(`Delete ${farm.name}`);
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
        ))}
      </ScrollView>

      {/* Edit Modal */}
      <EditModal
        visible={editModalVisible}
        farm={selectedFarm}
        onClose={() => setEditModalVisible(false)}
        onSave={updateFarm}
      />
    </>
  );
};

export default AccountScreen;

const localStyles = StyleSheet.create({
  settingsModal: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: 160,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  modalText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#333',
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#d4edda',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginBottom: 8,
  },
  statusActive: {
    backgroundColor: '#d4edda',
  },
  statusText: {
    fontSize: 12,
    color: '#155724',
  },
});
