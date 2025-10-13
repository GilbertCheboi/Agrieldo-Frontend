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
import {updateFarm, deleteFarm} from '../utils/api.js';

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
        ' http://192.168.100.4:8000/api/farms/get_farms',
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

  const handleDelete = async id => {
    try {
      await deleteFarm(id);
      Alert.alert('Success', 'Farm deleted successfully');
      // Refresh your list after delete
      fetchFarms();
    } catch (err) {
      console.error('Delete failed:', err);
      logErrorToFile(err);
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

  // return (
  //   <>
  //     <ScrollView style={styles.container}>
  //       {farms.map((farm, index) => (
  //         <TouchableOpacity
  //           key={farm.id || index}
  //           style={styles.cameraContainer}
  //           activeOpacity={0.9}
  //           onPress={() =>
  //             navigation.navigate('FarmDashboard', {farmId: farm.id})
  //           }>
  //           {/* Title + Settings */}
  //           <View style={styles.nameAndStatus}>
  //             <Text style={styles.cameraTitle}>
  //               {farm.name || `Farm ${index + 1}`}
  //             </Text>

  //             <Text style={styles.cameraTitle}>{farm.type || `Dairy`}</Text>

  //             {/* Prevent settings icon from triggering parent onPress */}
  //             <TouchableOpacity
  //               onPress={e => {
  //                 e.stopPropagation(); // ✅ prevent parent touch
  //                 setActiveSettingsIndex(
  //                   activeSettingsIndex === index ? null : index,
  //                 );
  //               }}>
  //               <Icon name="settings" size={22} color="#ffa500" />
  //             </TouchableOpacity>
  //           </View>

  //           {/* Image Feed */}
  //           <View style={styles.videoContainer}>
  //             <Image
  //               source={
  //                 farm.image
  //                   ? {uri: ` http://192.168.100.4:8000${farm.image}`}
  //                   : require('../assets/vinny.png')
  //               }
  //               style={styles.videoFeed}
  //               resizeMode="cover"
  //             />
  //             <View style={styles.videoTextDisplay}>
  //               <Text style={styles.videoText}>
  //                 {farm.location || 'Farm Live Feed'}
  //               </Text>

  //               {/* Show real updated_at */}
  //               <Text style={styles.lastUpdatedText}>
  //                 {farm.updated_at
  //                   ? `Updated: ${new Date(farm.updated_at).toLocaleString()}`
  //                   : 'No updates yet'}
  //               </Text>
  //             </View>
  //           </View>

  //           {/* Settings Modal */}
  //           {activeSettingsIndex === index && (
  //             <View style={localStyles.settingsModal}>
  //               <View
  //                 style={[localStyles.statusBadge, localStyles.statusActive]}>
  //                 <Text style={localStyles.statusText}>Active</Text>
  //               </View>

  //               <TouchableOpacity
  //                 style={localStyles.modalItem}
  //                 onPress={() => {
  //                   fetchFarms();
  //                   setActiveSettingsIndex(null);
  //                 }}>
  //                 <Icon name="refresh-ccw" size={18} color="#333" />
  //                 <Text style={localStyles.modalText}>Refresh</Text>
  //               </TouchableOpacity>

  //               <TouchableOpacity
  //                 style={localStyles.modalItem}
  //                 onPress={() => {
  //                   setSelectedFarm(farm);
  //                   setEditModalVisible(true);
  //                   setActiveSettingsIndex(null);
  //                 }}>
  //                 <Icon name="edit" size={18} color="#333" />
  //                 <Text style={localStyles.modalText}>Edit Farm</Text>
  //               </TouchableOpacity>

  //               <TouchableOpacity
  //                 style={localStyles.modalItem}
  //                 onPress={() => {
  //                   Alert.alert(
  //                     'Confirm Delete',
  //                     `Are you sure you want to delete ${farm.name}?`,
  //                     [
  //                       {text: 'Cancel', style: 'cancel'},
  //                       {
  //                         text: 'Delete',
  //                         style: 'destructive',
  //                         onPress: () => handleDelete(farm.id),
  //                       },
  //                     ],
  //                   );
  //                   setActiveSettingsIndex(null);
  //                 }}>
  //                 <Icon name="trash" size={18} color="red" />
  //                 <Text style={[localStyles.modalText, {color: 'red'}]}>
  //                   Delete
  //                 </Text>
  //               </TouchableOpacity>
  //             </View>
  //           )}
  //         </TouchableOpacity>
  //       ))}
  //     </ScrollView>
  //     {/* Floating + Button */}
  //     <TouchableOpacity
  //       style={localStyles.fab}
  //       onPress={() => setAddModalVisible(true)}>
  //       <Icon name="plus" size={28} color="#fff" />
  //     </TouchableOpacity>

  //     {/* Edit Modal */}
  //     <EditFarmModal
  //       visible={editModalVisible}
  //       farm={selectedFarm}
  //       onClose={() => setEditModalVisible(false)}
  //       onUpdated={fetchFarms}
  //     />

  //     <AddFarmModal
  //       visible={addModalVisible}
  //       onClose={() => setAddModalVisible(false)}
  //       onSave={newFarm => {
  //         // just update the state locally with the newly created farm
  //         setFarms(prev => [newFarm, ...prev]);
  //         setAddModalVisible(false);
  //       }}
  //     />
  //   </>
  // );

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{flexGrow: 1}}>
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

                <Text style={styles.cameraTitle}>{farm.type || `Dairy`}</Text>

                <TouchableOpacity
                  onPress={e => {
                    e.stopPropagation();
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
                  source={
                    farm.image
                      ? {uri: ` http://192.168.100.4:8000${farm.image}`}
                      : require('../assets/vinny.png')
                  }
                  style={styles.videoFeed}
                  resizeMode="cover"
                />
                <View style={styles.videoTextDisplay}>
                  <Text style={styles.videoText}>
                    {farm.location || 'Farm Live Feed'}
                  </Text>

                  <Text style={styles.lastUpdatedText}>
                    {farm.updated_at
                      ? `Updated: ${new Date(farm.updated_at).toLocaleString()}`
                      : 'No updates yet'}
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

      {/* Edit Modal */}
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
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ffa500',
    width: 40,
    height: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 3,
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
