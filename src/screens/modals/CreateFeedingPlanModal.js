// components/CreateFeedingPlanModal.js
import React, {useEffect, useState} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Picker} from '@react-native-picker/picker';
import {getFeeds, createFeedingPlan} from '../../utils/api';

const CreateFeedingPlanModal = ({visible, onClose, onPlanCreated}) => {
  const [formData, setFormData] = useState({
    name: '',
    items: [{feed_id: '', quantity_per_animal: ''}],
  });
  const [feeds, setFeeds] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFeeds = async () => {
      setLoading(true);
      try {
        const data = await getFeeds();
        setFeeds(data || []);
      } catch (err) {
        console.error('Error fetching feeds:', err);
        setError('Failed to load feeds');
      } finally {
        setLoading(false);
      }
    };
    if (visible) fetchFeeds();
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      setMessage('');
    }
  }, [visible]);

  const handleChange = (field, value, index = null) => {
    if (index === null) {
      setFormData({...formData, [field]: value});
    } else {
      const newItems = [...formData.items];
      newItems[index][field] = value;
      setFormData({...formData, items: newItems});
    }
    setMessage('');
    setError('');
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, {feed_id: '', quantity_per_animal: ''}],
    });
  };

  const removeItem = index => {
    if (formData.items.length === 1) return;
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({...formData, items: newItems});
  };

  const handleSubmit = async () => {
    setMessage('');
    setError('');

    const dataToSend = {
      name: formData.name,
      items: formData.items.map(item => ({
        feed_id: item.feed_id,
        quantity_per_animal: item.quantity_per_animal,
      })),
    };

    if (!dataToSend.name) {
      setError('Plan name is required');
      return;
    }
    if (
      dataToSend.items.length === 0 ||
      dataToSend.items.some(item => !item.feed_id || !item.quantity_per_animal)
    ) {
      setError('All feed items must have a feed and quantity');
      return;
    }

    try {
      setLoading(true);
      const response = await createFeedingPlan(dataToSend);
      setMessage('Feeding plan created successfully');
      onPlanCreated(response);
      setFormData({name: '', items: [{feed_id: '', quantity_per_animal: ''}]});
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error('API Error:', err.response || err);
      setError(err.response?.data?.error || 'Failed to create feeding plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={styles.backdrop}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.modalBox}>
          <Text style={styles.title}>Create Feeding Plan</Text>

          {loading && <ActivityIndicator size="large" color="#000" />}

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{paddingBottom: 20}}>
            {/* Plan Name */}
            <TextInput
              style={styles.input}
              placeholder="Plan Name"
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
            />

            {formData.items.map((item, index) => (
              <View key={index} style={styles.feedRow}>
                {/* Feed select */}
                <View style={styles.feedSelect}>
                  <Text style={styles.label}>Feed</Text>
                  <View style={styles.pickerWrapper}>
                    <Picker
                      selectedValue={item.feed_id}
                      style={styles.inputSmall}
                      onValueChange={val =>
                        handleChange('feed_id', val, index)
                      }>
                      <Picker.Item
                        label="-- Select Feed --"
                        value=""
                        enabled={false}
                      />
                      {feeds.map(feed => (
                        <Picker.Item
                          key={feed.id}
                          label={feed.name}
                          value={feed.id}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Qty input with label */}
                <View style={styles.qtyBox}>
                  <Text style={styles.label}>Qty</Text>
                  <TextInput
                    style={styles.inputSmall}
                    placeholder="kg"
                    keyboardType="numeric"
                    value={item.quantity_per_animal.toString()}
                    onChangeText={text =>
                      handleChange('quantity_per_animal', text, index)
                    }
                  />
                </View>

                {/* Remove button */}

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeItem(index)}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Feed Item */}
            <TouchableOpacity style={styles.addBtn} onPress={addItem}>
              <Text style={styles.addText}>+ Add Feed</Text>
            </TouchableOpacity>

            {/* Submit */}
            <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
              <Text style={styles.submitText}>Create Plan</Text>
            </TouchableOpacity>

            {message ? <Text style={styles.success}>{message}</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Close */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalBox: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
  },
  feedRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  feedSelect: {
    flex: 1,
    marginRight: 5,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    height: 40, // 👈 makes dropdown same height as Qty
    justifyContent: 'center',
  },
  inputSmall: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    paddingHorizontal: 8,
    textAlign: 'center',
  },
  qtyBox: {
    width: 80,
    marginRight: 5,
  },
  deleteBtn: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 6,
    justifyContent: 'center',
  },
  deleteText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  addBtn: {
    borderWidth: 1,
    borderColor: '#ffa500',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  addText: {color: '#ffa500', fontWeight: 'bold'},
  submitBtn: {
    backgroundColor: '#ffa500',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  submitText: {color: '#fff', fontWeight: 'bold'},
  success: {color: 'green', marginTop: 10, textAlign: 'center'},
  error: {color: 'red', marginTop: 10, textAlign: 'center'},
  closeBtn: {
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  closeText: {color: '#333'},
  deleteButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateFeedingPlanModal;
