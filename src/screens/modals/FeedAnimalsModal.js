import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
  Modal,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {feedAnimals, getFeedingPlans} from '../../utils/api';

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
  const [formData, setFormData] = useState({
    category: '',
    plan_id: '',
    feeding_date: '',
  });
  const [feedingPlans, setFeedingPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({type: '', text: ''});
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await getFeedingPlans();
        setFeedingPlans(data || []);
      } catch (err) {
        console.error('Error fetching plans:', err);
        setMessage({type: 'error', text: 'Failed to load feeding plans'});
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (name, value) => {
    setFormData({...formData, [name]: value});
    setMessage({type: '', text: ''});
  };

  const handleSubmit = async () => {
    if (!formData.category || !formData.plan_id || !formData.feeding_date) {
      return setMessage({
        type: 'error',
        text: 'Category, Plan, and Date are required',
      });
    }

    try {
      setLoading(true);
      const response = await feedAnimals(formData);
      setMessage({type: 'success', text: response.message || 'Animals fed!'});
      onFeedUpdated();
      setFormData({category: '', plan_id: '', feeding_date: ''});
      setTimeout(() => onClose(), 1000);
    } catch (err) {
      console.error('API Error:', err.response || err);
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
      const isoDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
      handleChange('feeding_date', isoDate);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardWrapper}>
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
          <Text style={styles.title}>Feed Animals</Text>

          {/* Category Dropdown */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.category}
              onValueChange={value => handleChange('category', value)}>
              <Picker.Item
                label="-- Select Category --"
                value=""
                enabled={false}
              />
              {categories.map(cat => (
                <Picker.Item key={cat} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          {/* Feeding Plan Dropdown */}
          <Text style={styles.label}>Feeding Plan</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={formData.plan_id}
              onValueChange={value => handleChange('plan_id', value)}>
              <Picker.Item label="-- Select Plan --" value="" enabled={false} />
              {feedingPlans.map(plan => (
                <Picker.Item key={plan.id} label={plan.name} value={plan.id} />
              ))}
            </Picker>
          </View>

          {/* Feeding Date */}
          <Text style={styles.label}>Feeding Date</Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}>
            <Text>
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

          {/* Message */}
          {message.text ? (
            <Text
              style={[
                styles.message,
                message.type === 'error' ? styles.error : styles.success,
              ]}>
              {message.text}
            </Text>
          ) : null}

          {/* Buttons */}
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Feed Now</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  cardWrapper: {
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 4,
  },
  title: {fontSize: 20, fontWeight: 'bold', marginBottom: 16},
  label: {marginTop: 12, fontWeight: '600'},
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginVertical: 8,
    overflow: 'hidden',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#3bca47ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
  outlinedButton: {
    borderWidth: 1,
    borderColor: '#3bca47ff',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  outlinedText: {
    color: '#3bca47ff',
    fontWeight: '600',
  },
  cancelButton: {marginTop: 10, alignItems: 'center'},
  cancelText: {color: '#666', fontSize: 14},
  message: {textAlign: 'center', marginTop: 10, fontSize: 14},
  error: {color: 'red'},
  success: {color: 'green'},
});

export default FeedAnimalsModal;
