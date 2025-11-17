import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {
  getFarms,
  getUsers,
  getFarmStaff,
  getFarmVets,
  addFarmStaff,
  addFarmVet,
  removeFarmStaff,
  removeFarmVet,
} from '../utils/api';

const FarmTeamScreen = ({route}) => {
  const [tab, setTab] = useState('staff');
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState('');
  const [users, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.farmId)
      setSelectedFarmId(route.params.farmId.toString());
  }, [route]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setFarms(await getFarms());
        setUsers(await getUsers());
      } catch (e) {
        console.error('Fetch error', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedFarmId) return;
    const fetcher = tab === 'staff' ? getFarmStaff : getFarmVets;
    fetcher(selectedFarmId)
      .then(setMembers)
      .catch(e => console.error('Load error:', e));
  }, [selectedFarmId, tab]);

  const handleAdd = async () => {
    if (!selectedUser || !selectedFarmId) return;
    setLoading(true);
    try {
      const addFn = tab === 'staff' ? addFarmStaff : addFarmVet;
      const res = await addFn(selectedFarmId, selectedUser);
      setMembers(p => [...p, res]);
      Alert.alert('✅ Success', `${tab} added successfully`);
      setModalVisible(false);
      setSelectedUser('');
    } catch (e) {
      Alert.alert('Error', 'Could not add user');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async uid => {
    try {
      const rmFn = tab === 'staff' ? removeFarmStaff : removeFarmVet;
      await rmFn(selectedFarmId, uid);
      setMembers(p => p.filter(m => m.user.id !== uid));
    } catch {
      Alert.alert('Error', 'Could not remove');
    }
  };

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabRow}>
        {['staff', 'vets'].map(t => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.activeTab]}
            onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && styles.activeTabText]}>
              {t === 'staff' ? '👨‍🌾 Staff' : '🐄 Vets'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.title}>
        {tab === 'staff' ? 'Manage Farm Employees' : 'Manage Farm Vets'}
      </Text>

      {/* Farm Dropdown */}
      <Text style={styles.label}>Select Farm</Text>
      <View style={styles.visiblePickerBox}>
        <Picker
          selectedValue={selectedFarmId}
          onValueChange={setSelectedFarmId}
          style={styles.picker}
          dropdownIconColor="#333">
          <Picker.Item label="🔽 Select a Farm" value="" color="#777" />
          {farms.map(f => (
            <Picker.Item key={f.id} label={f.name} value={f.id} color="#000" />
          ))}
        </Picker>
      </View>

      {loading ? (
        <ActivityIndicator color="#ffa500" style={{marginTop: 20}} />
      ) : selectedFarmId ? (
        members.length ? (
          <FlatList
            data={members}
            keyExtractor={i => i.id.toString()}
            renderItem={({item}) => (
              <View style={styles.memberRow}>
                <View style={{flex: 1}}>
                  <Text style={styles.name}>
                    {item.user.first_name} {item.user.last_name}
                  </Text>
                  <Text style={styles.email}>{item.user.email}</Text>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemove(item.user.id)}>
                  <Text style={styles.removeTxt}>Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        ) : (
          <Text style={styles.empty}>No {tab} assigned yet.</Text>
        )
      ) : (
        <Text style={styles.empty}>Please select a farm to begin.</Text>
      )}

      {/* Floating Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
        disabled={!selectedFarmId}>
        <Text style={styles.fabTxt}>＋</Text>
      </TouchableOpacity>

      {/* Add Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              Add {tab === 'staff' ? 'Employee' : 'Vet'}
            </Text>
            <Text style={styles.label}>Select {tab}</Text>
            <View style={styles.visiblePickerBox}>
              <Picker
                selectedValue={selectedUser}
                onValueChange={setSelectedUser}
                style={styles.picker}
                dropdownIconColor="#333">
                <Picker.Item label={`🔽 Select ${tab}`} value="" color="#777" />
                {users.map(u => (
                  <Picker.Item
                    key={u.id}
                    label={`${u.first_name} ${u.username}`}
                    value={u.id}
                    color="#000"
                  />
                ))}
              </Picker>
            </View>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleAdd}
              disabled={loading}>
              <Text style={styles.saveTxt}>
                {loading ? 'Saving...' : 'Add'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default FarmTeamScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f9f9f9', padding: 16},
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 10,
  },
  tab: {flex: 1, alignItems: 'center', paddingVertical: 10},
  activeTab: {backgroundColor: '#ffa500'},
  tabText: {fontWeight: '600', color: '#555'},
  activeTabText: {color: '#fff'},
  title: {fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 10},
  label: {color: '#555', fontWeight: '600', marginBottom: 6, marginLeft: 4},
  visiblePickerBox: {
    borderWidth: 1.2,
    borderColor: '#ffa500',
    borderRadius: 10,
    backgroundColor: '#fff7ed',
    marginBottom: 20,
    overflow: 'hidden',
  },
  picker: {color: '#000', height: Platform.OS === 'ios' ? 180 : 50},
  memberRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
  },
  name: {fontWeight: '600', color: '#333'},
  email: {fontSize: 13, color: '#777'},
  removeBtn: {
    backgroundColor: '#ff4d4d',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  removeTxt: {color: '#fff', fontWeight: '600'},
  empty: {
    textAlign: 'center',
    color: '#777',
    marginTop: 30,
    fontStyle: 'italic',
  },
  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
    backgroundColor: '#ffa500',
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  fabTxt: {color: '#fff', fontSize: 30, fontWeight: 'bold'},
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
    color: '#333',
  },
  saveBtn: {
    backgroundColor: '#3bca47',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  saveTxt: {textAlign: 'center', color: '#fff', fontWeight: '700'},
  cancelBtn: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  cancelTxt: {textAlign: 'center', color: '#333'},
});
