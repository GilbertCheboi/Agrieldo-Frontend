import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  feedAnimals,
  getFeedingPlans,
  getFarms,
  getStaffFarms,
  getFeeds,
} from '../../utils/api';

const categories = [
  'Calf (0-3 months)',
  'Weaner Stage 1 (3-6 months)',
  'Weaner Stage 2 (6-9 months)',
  'Yearling (9-12 months)',
  'Bulling (12-15 months)',
  'In-Calf',
  'Steaming',
  'Heifer',
  'Early Lactating',
  'Mid Lactating',
  'Late Lactating',
  'Dry',
  'Bull',
];

const FeedAnimalsModal = ({onClose, onFeedUpdated}) => {
  const [farms, setFarms] = useState([]);
  const [feedingPlans, setFeedingPlans] = useState([]);
  const [storeFeeds, setStoreFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({type: '', text: ''});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [feedSummary, setFeedSummary] = useState(null);

  const [formData, setFormData] = useState({
    store_id: '',
    category: '',
    plan_id: '',
    feeding_date: '',
  });

  // 🧭 Fetch farms
  const fetchFarms = async () => {
    try {
      setLoading(true);
      const userType = await AsyncStorage.getItem('user_type');
      let data =
        userType === 'staff' ? await getStaffFarms() : await getFarms();
      if (!Array.isArray(data)) data = [];

      const formatted = data.map(farm => ({
        ...farm,
        feed_stores: Array.isArray(farm.feed_stores) ? farm.feed_stores : [],
      }));

      setFarms(formatted);
    } catch (error) {
      console.error('❌ Error fetching farms:', error);
      Alert.alert('Error', 'Could not load farms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarms();
  }, []);

  // 🔁 Fetch feeding plans + feeds when store changes
  useEffect(() => {
    if (!formData.store_id) return;
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const plans = await getFeedingPlans(formData.store_id);
        setFeedingPlans(Array.isArray(plans) ? plans : plans?.plans || []);
        const feeds = await getFeeds(formData.store_id);
        setStoreFeeds(feeds || []);
      } catch (err) {
        console.error('❌ Error fetching plans/feeds:', err);
        setMessage({type: 'error', text: 'Failed to load feeding plans'});
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, [formData.store_id]);

  const handleChange = (name, value) => {
    setFormData({...formData, [name]: value});
    setMessage({type: '', text: ''});
  };

  const handleSubmit = async () => {
    const {store_id, category, plan_id, feeding_date} = formData;
    if (!store_id || !category || !plan_id || !feeding_date) {
      return setMessage({
        type: 'error',
        text: 'Store, Category, Plan, and Date are required.',
      });
    }

    try {
      setLoading(true);
      setMessage({type: '', text: ''});
      setFeedSummary(null);

      const payload = {
        store_id,
        category,
        plan_id: Number(plan_id),
        feeding_date,
      };

      const response = await feedAnimals(payload);

      // ✅ Capture backend values
      const numFed = response.num_animals || 0;
      const successMsg =
        response.message ||
        `Fed ${numFed} animal${numFed !== 1 ? 's' : ''} successfully.`;

      setMessage({type: 'success', text: successMsg});
      setFeedSummary({numFed, details: response.deductions || []});

      onFeedUpdated?.();

      const updatedFeeds = await getFeeds(store_id);
      setStoreFeeds(updatedFeeds || []);

      // Auto-close modal after 5s
      setTimeout(() => {
        setFeedSummary(null);
        setMessage({type: '', text: ''});
        onClose();
      }, 5000);
    } catch (err) {
      console.error(
        '❌ feedAnimals() Error:',
        err.response?.data || err.message,
      );
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to feed animals',
      });
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const isoDate = selectedDate.toISOString().split('T')[0];
      handleChange('feeding_date', isoDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
          <Text style={styles.title}>Feed Animals</Text>

          {/* 🏠 Store Picker */}
          <Text style={styles.label}>Select Store (Farm → Store)</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.store_id}
              onValueChange={value => handleChange('store_id', value)}
              style={styles.picker}>
              <Picker.Item label="-- Select Store --" value="" color="#888" />
              {farms.map(farm =>
                farm.feed_stores?.length ? (
                  farm.feed_stores.map(store => (
                    <Picker.Item
                      key={store.id}
                      label={`${farm.name} → ${store.name}`}
                      value={store.id}
                    />
                  ))
                ) : (
                  <Picker.Item
                    key={`nostore-${farm.id}`}
                    label={`${farm.name} (no stores)`}
                    value=""
                    color="#888"
                    enabled={false}
                  />
                ),
              )}
            </Picker>
          </View>

          {/* 🐄 Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.category}
              onValueChange={value => handleChange('category', value)}
              style={styles.picker}>
              <Picker.Item
                label="-- Select Category --"
                value=""
                color="#888"
              />
              {categories.map(cat => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          {/* 🪣 Feeding Plan */}
          <Text style={styles.label}>Feeding Plan</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.plan_id}
              onValueChange={value => handleChange('plan_id', value)}
              style={styles.picker}>
              <Picker.Item label="-- Select Plan --" value="" color="#888" />
              {feedingPlans.map(plan => (
                <Picker.Item key={plan.id} label={plan.name} value={plan.id} />
              ))}
            </Picker>
          </View>

          {/* 📅 Feeding Date */}
          <Text style={styles.label}>Feeding Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}>
            <Text style={{color: formData.feeding_date ? '#333' : '#888'}}>
              {formData.feeding_date || 'Select Feeding Date (YYYY-MM-DD)'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={
                formData.feeding_date
                  ? new Date(formData.feeding_date)
                  : new Date()
              }
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onDateChange}
            />
          )}

          {/* 📢 Message */}
          {message.text ? (
            <View
              style={[
                styles.messageBox,
                message.type === 'error' ? styles.errorBox : styles.successBox,
              ]}>
              <Text
                style={[
                  styles.messageText,
                  message.type === 'error' ? styles.error : styles.success,
                ]}>
                {message.text}
              </Text>
            </View>
          ) : null}

          {/* 🐮 Feed Summary */}
          {feedSummary && (
            <View style={styles.summaryBox}>
              <Text style={styles.summaryTitle}>✅ Feed Summary</Text>
              <Text style={styles.summaryText}>
                {feedSummary.numFed} animal
                {feedSummary.numFed !== 1 ? 's' : ''} fed successfully.
              </Text>
              {feedSummary.details?.length > 0 && (
                <View>
                  {feedSummary.details.map((item, idx) => (
                    <Text key={idx} style={styles.feedItem}>
                      • {item.feed}: {item.deducted} kg
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Buttons */}
          <TouchableOpacity
            style={[styles.button, loading && {opacity: 0.7}]}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Feed Now</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Close</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

// 💅 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardWrapper: {
    width: '90%',
    maxHeight: '85%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 5,
  },
  title: {fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#333'},
  label: {marginTop: 12, fontWeight: '600', color: '#333'},
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  picker: {color: '#333'},
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#3bca47',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  cancelButton: {marginTop: 10, alignItems: 'center'},
  cancelText: {color: '#666', fontSize: 14},
  messageBox: {
    marginTop: 15,
    borderRadius: 6,
    padding: 10,
  },
  successBox: {
    backgroundColor: '#e6f9ea',
    borderColor: '#3bca47',
    borderWidth: 1,
  },
  errorBox: {
    backgroundColor: '#fdecea',
    borderColor: '#d32f2f',
    borderWidth: 1,
  },
  messageText: {textAlign: 'center', fontSize: 14},
  success: {color: '#2e7d32'},
  error: {color: '#d32f2f'},
  summaryBox: {
    marginTop: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
  },
  summaryTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2e7d32',
    marginBottom: 4,
  },
  summaryText: {fontSize: 14, color: '#333', marginBottom: 5},
  feedItem: {fontSize: 13, color: '#555', marginLeft: 5},
});

export default FeedAnimalsModal;
