import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {getFeeds, addFeedToStore} from '../../utils/api';

const AddFeedModal = ({onClose, onFeedAdded, storeId}) => {
  const [formData, setFormData] = useState({
    name: '',
    quantity_kg: '',
    price_per_kg: '',
  });
  const [feeds, setFeeds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({type: '', text: ''});
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchFeeds = async () => {
      try {
        const data = await getFeeds();
        setFeeds(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching feeds:', err);
        setFeeds([]);
      }
    };
    fetchFeeds();
  }, []);

  const handleChange = (name, value) => {
    setFormData({...formData, [name]: value});
    setMessage({type: '', text: ''});

    if (name === 'name') {
      const results = feeds.filter(feed =>
        feed.name.toLowerCase().includes(value.toLowerCase()),
      );
      setSearchResults(results);
    }
  };

  const handleSubmit = async () => {
    setMessage({type: '', text: ''});

    if (!storeId) {
      return setMessage({type: 'error', text: 'Store ID missing'});
    }

    const dataToSend = {
      name: formData.name.trim(),
      quantity_kg: parseFloat(formData.quantity_kg) || 0,
      price_per_kg: formData.price_per_kg
        ? parseFloat(formData.price_per_kg)
        : undefined,
      store: storeId, // ✅ Include store ID here
    };

    if (!dataToSend.name) {
      return setMessage({type: 'error', text: 'Feed name is required'});
    }
    if (dataToSend.quantity_kg <= 0) {
      return setMessage({
        type: 'error',
        text: 'Quantity must be greater than 0',
      });
    }

    setLoading(true);
    try {
      const newFeed = await addFeedToStore(dataToSend);
      onFeedAdded(newFeed);
      setMessage({
        type: 'success',
        text: `${dataToSend.quantity_kg} kg of ${dataToSend.name} added`,
      });
      setFormData({name: '', quantity_kg: '', price_per_kg: ''});
      setTimeout(() => onClose(), 1000);
    } catch (error) {
      console.error('API Error:', error.response || error);
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to add feed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.cardWrapper}>
        <ScrollView contentContainerStyle={{paddingBottom: 20}}>
          <Text style={styles.title}>Add Feed to Store</Text>

          <TextInput
            style={styles.input}
            placeholder="Feed Name"
            placeholderTextColor="#888"
            value={formData.name}
            onChangeText={text => handleChange('name', text)}
          />

          {searchResults.length > 0 && (
            <FlatList
              data={searchResults}
              keyExtractor={item => item.id.toString()}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={() => {
                    setFormData({...formData, name: item.name});
                    setSearchResults([]);
                  }}>
                  <Text style={styles.suggestion}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Quantity (kg)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={formData.quantity_kg}
            onChangeText={text => handleChange('quantity_kg', text)}
          />

          <TextInput
            style={styles.input}
            placeholder="Price per kg (optional)"
            placeholderTextColor="#888"
            keyboardType="numeric"
            value={formData.price_per_kg}
            onChangeText={text => handleChange('price_per_kg', text)}
          />

          {message.text ? (
            <Text
              style={[
                styles.message,
                message.type === 'error' ? styles.error : styles.success,
              ]}>
              {message.text}
            </Text>
          ) : null}

          <TouchableOpacity
            style={styles.button}
            onPress={handleSubmit}
            disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Add or Top Up Feed</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
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
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  suggestion: {
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    color: '#333',
  },
  button: {
    backgroundColor: '#ffa500',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 10,
    alignItems: 'center',
  },
  cancelText: {
    color: '#666',
    fontSize: 14,
  },
  message: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  error: {color: 'red'},
  success: {color: 'green'},
});

export default AddFeedModal;
