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
  useColorScheme,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-picker/picker';
import {getFeeds, createFeedingPlan} from '../../utils/api';

const CreateFeedingPlanModal = ({visible, onClose, onPlanCreated, storeId}) => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const backgroundColor = colorScheme === 'dark' ? '#333' : '#fff';

  const [formData, setFormData] = useState({
    name: '',
    items: [{feed: '', quantity_per_animal: ''}],
  });
  const [feeds, setFeeds] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // 🔸 Fetch feeds for selected store
  useEffect(() => {
    const fetchFeedsForStore = async () => {
      if (!storeId) return;
      setLoading(true);
      try {
        const data = await getFeeds(storeId); // expects API endpoint ?store=storeId
        setFeeds(data || []);
      } catch (err) {
        console.error('Error fetching feeds:', err);
        setError('Failed to load feeds for this store.');
      } finally {
        setLoading(false);
      }
    };

    if (visible) fetchFeedsForStore();
  }, [visible, storeId]);

  // 🔸 Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setMessage('');
      setError('');
      setFormData({name: '', items: [{feed: '', quantity_per_animal: ''}]});
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
      items: [...formData.items, {feed: '', quantity_per_animal: ''}],
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

    if (!storeId) {
      setError('Please select a store before creating a plan.');
      return;
    }

    const dataToSend = {
      name: formData.name,
      store: storeId, // ✅ backend expects "store"
      items: formData.items.map(item => ({
        feed: item.feed, // ✅ backend expects "feed"
        quantity_per_animal: parseFloat(item.quantity_per_animal),
      })),
    };

    if (!dataToSend.name.trim()) {
      setError('Plan name is required.');
      return;
    }

    if (
      dataToSend.items.length === 0 ||
      dataToSend.items.some(item => !item.feed || !item.quantity_per_animal)
    ) {
      setError('All feed items must have a feed and quantity.');
      return;
    }

    try {
      setLoading(true);
      const response = await createFeedingPlan(dataToSend);
      setMessage('Feeding plan created successfully!');
      onPlanCreated?.(response);
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error('API Error:', err.response || err);
      setError(
        err.response?.data?.non_field_errors?.[0] ||
          err.response?.data?.error ||
          'Failed to create feeding plan.',
      );
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
        <View style={[styles.modalBox, {backgroundColor}]}>
          <Text style={[styles.title, {color: textColor}]}>
            Create Feeding Plan
          </Text>

          {loading && <ActivityIndicator size="large" color="#ffa500" />}

          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{paddingBottom: 20}}>
            {/* Plan Name */}
            <TextInput
              style={[styles.input, {color: textColor, backgroundColor}]}
              placeholder="Plan Name"
              placeholderTextColor="#888"
              value={formData.name}
              onChangeText={text => handleChange('name', text)}
            />

            {/* Feed Items */}
            {formData.items.map((item, index) => (
              <View key={index} style={styles.feedRow}>
                {/* Feed Picker */}
                <View style={styles.feedSelect}>
                  <Text style={[styles.label, {color: textColor}]}>Feed</Text>
                  <View style={[styles.pickerWrapper, {backgroundColor}]}>
                    <Picker
                      selectedValue={item.feed}
                      style={[styles.inputSmall, {color: textColor}]}
                      dropdownIconColor={textColor}
                      onValueChange={val => handleChange('feed', val, index)}>
                      <Picker.Item
                        label="-- Select Feed --"
                        value=""
                        enabled={false}
                        color="#888"
                      />
                      {feeds.map(feed => (
                        <Picker.Item
                          key={feed.id}
                          label={feed.name}
                          value={feed.id}
                          color={textColor}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>

                {/* Quantity */}
                <View style={styles.qtyBox}>
                  <Text style={[styles.label, {color: textColor}]}>
                    Qty (kg)
                  </Text>
                  <TextInput
                    style={[
                      styles.inputSmall,
                      {color: textColor, backgroundColor},
                    ]}
                    placeholder="kg"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    value={item.quantity_per_animal.toString()}
                    onChangeText={text =>
                      handleChange('quantity_per_animal', text, index)
                    }
                  />
                </View>

                {/* Remove */}
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => removeItem(index)}>
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Add Feed */}
            <TouchableOpacity style={styles.addBtn} onPress={addItem}>
              <Text style={styles.addText}>+ Add Feed</Text>
            </TouchableOpacity>

            {/* Submit */}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={handleSubmit}
              disabled={loading}>
              <Text style={styles.submitText}>Create Plan</Text>
            </TouchableOpacity>

            {message ? <Text style={styles.success}>{message}</Text> : null}
            {error ? <Text style={styles.error}>{error}</Text> : null}

            {/* Close */}
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Text style={[styles.closeText, {color: textColor}]}>Close</Text>
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
    width: '92%',
    maxHeight: '85%',
    borderRadius: 12,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
    marginBottom: 14,
  },
  feedRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  feedSelect: {
    flex: 1,
    marginRight: 6,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    height: 40,
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
  deleteButton: {
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    borderWidth: 1,
    borderColor: '#ffa500',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    alignItems: 'center',
  },
  addText: {
    color: '#ffa500',
    fontWeight: 'bold',
  },
  submitBtn: {
    backgroundColor: '#ffa500',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 5,
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  success: {
    marginTop: 10,
    textAlign: 'center',
    color: 'green',
  },
  error: {
    marginTop: 10,
    textAlign: 'center',
    color: 'red',
  },
  closeBtn: {
    marginTop: 18,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
  },
  closeText: {
    fontWeight: '500',
  },
});

export default CreateFeedingPlanModal;
