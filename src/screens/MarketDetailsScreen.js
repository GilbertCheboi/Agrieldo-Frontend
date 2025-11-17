import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {getMarketListingDetails, toggleListingStatus} from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MarketDetailsScreen = ({route, navigation}) => {
  const {listingId} = route.params;

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSeller, setIsSeller] = useState(false);

  const loadListing = async () => {
    try {
      const data = await getMarketListingDetails(listingId);
      setListing(data);

      const userId = await AsyncStorage.getItem('user_id');
      if (userId && parseInt(userId) === data.seller) {
        setIsSeller(true);
      }
    } catch (err) {
      console.log('Error loading listing:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListing();
  }, []);

  /** -------------------------------
   * CALL SELLER
   * -------------------------------- */
  const handleCallSeller = () => {
    const phone = listing?.animal?.owner_details?.phone_number;
    if (!phone) {
      Alert.alert('Unavailable', 'Seller phone number not provided.');
      return;
    }
    Linking.openURL(`tel:${phone}`);
  };

  /** -------------------------------
   * WHATSAPP SELLER
   * -------------------------------- */
  const handleWhatsAppSeller = () => {
    let phone = listing?.animal?.owner_details?.phone_number;

    if (!phone) {
      Alert.alert('Unavailable', 'Seller WhatsApp number not provided.');
      return;
    }

    phone = phone.replace(/\D/g, '');

    if (phone.startsWith('0')) {
      phone = '254' + phone.substring(1);
    } else if (!phone.startsWith('254')) {
      phone = '254' + phone;
    }

    const message = `Hello, I'm interested in your animal listed on Agrieldo Market.`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Unable to open WhatsApp.'),
    );
  };

  const handleStatusChange = async newStatus => {
    try {
      await toggleListingStatus(listing.id, newStatus);
      Alert.alert('Success', `Listing updated to: ${newStatus}`);
      loadListing();
    } catch (err) {
      console.log('Toggle Error:', err);
      Alert.alert('Error', 'Unable to change status.');
    }
  };

  /** -------------------------------
   * LOADING
   * -------------------------------- */
  if (loading || !listing) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );
  }

  const animal = listing.animal;
  const owner = animal.owner_details || {};

  const imageUrl =
    animal.images && animal.images.length > 0
      ? `http://api.agrieldo.com${animal.images[0].image}`
      : null;

  return (
    <ScrollView style={styles.container}>
      {/* IMAGE */}
      {imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Ionicons name="image-outline" size={60} color="#ccc" />
        </View>
      )}

      {/* TITLE */}
      <Text style={styles.name}>{animal.name}</Text>
      <Text style={styles.price}>KES {listing.price}</Text>

      {/* DETAILS */}
      <View style={styles.card}>
        <Text style={styles.label}>Tag:</Text>
        <Text style={styles.value}>{animal.tag}</Text>

        <Text style={styles.label}>Breed:</Text>
        <Text style={styles.value}>{animal.breed}</Text>

        <Text style={styles.label}>Gender:</Text>
        <Text style={styles.value}>{animal.gender}</Text>

        <Text style={styles.label}>DOB:</Text>
        <Text style={styles.value}>{animal.dob}</Text>

        <Text style={styles.label}>Seller Name:</Text>
        <Text style={styles.value}>{owner.username || 'Unknown'}</Text>

        <Text style={styles.label}>Phone:</Text>
        <Text style={styles.value}>{owner.phone_number || 'N/A'}</Text>
      </View>

      {/* DESCRIPTION */}
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.text}>
        {listing.description || 'No description provided'}
      </Text>

      {/* BUYER / SELLER ACTIONS */}
      {!isSeller ? (
        <>
          {/* CALL */}
          <TouchableOpacity style={styles.callBtn} onPress={handleCallSeller}>
            <Ionicons name="call-outline" size={20} color="#fff" />
            <Text style={styles.callText}>Call Seller</Text>
          </TouchableOpacity>

          {/* WHATSAPP */}
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={handleWhatsAppSeller}>
            <Ionicons name="logo-whatsapp" size={22} color="#fff" />
            <Text style={styles.callText}>WhatsApp Seller</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Manage Listing</Text>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleStatusChange('sold')}>
            <Text style={styles.actionText}>Mark as Sold</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={() => handleStatusChange('hidden')}>
            <Text style={styles.actionText}>Hide Listing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionBtn, {backgroundColor: '#ff3333'}]}
            onPress={() => handleStatusChange('active')}>
            <Text style={styles.actionText}>Activate Listing</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

export default MarketDetailsScreen;

/* ==========================
      STYLES
========================== */
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},

  image: {width: '100%', height: 260, resizeMode: 'cover'},
  noImage: {
    width: '100%',
    height: 260,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 12,
    paddingHorizontal: 15,
  },
  price: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffa500',
    paddingHorizontal: 15,
  },
  card: {
    backgroundColor: '#f7f7f7',
    padding: 10,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 5,
    borderRadius: 10,
    elevation: 1,
  },

  label: {
    fontWeight: '700',
    color: '#555',
    marginTop: 5,
    fontSize: 13,
  },

  value: {
    color: '#333',
    marginBottom: 3,
    fontSize: 13,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 15,
    marginTop: 20,
  },

  text: {
    paddingHorizontal: 15,
    marginTop: 8,
    color: '#555',
    lineHeight: 20,
  },

  callBtn: {
    backgroundColor: '#28a745',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 20,
  },

  whatsappBtn: {
    backgroundColor: '#25D366',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },

  callText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },

  actionBtn: {
    backgroundColor: '#333333',
    padding: 14,
    borderRadius: 10,
    marginHorizontal: 20,
    marginTop: 12,
    alignItems: 'center',
  },

  actionText: {
    color: '#ffa500',
    fontSize: 16,
    fontWeight: '700',
  },
});
