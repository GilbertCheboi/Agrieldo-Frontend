import React from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const AnimalCard = ({animal}) => {
  const imageUrl =
    animal.images && animal.images.length > 0
      ? `http://api.agrieldo.com${animal.images[0].image}`
      : null;

  return (
    <View style={styles.card}>
      {/* Animal Image */}
      {imageUrl ? (
        <Image source={{uri: imageUrl}} style={styles.image} />
      ) : (
        <View style={styles.noImage}>
          <Ionicons name="image-outline" size={40} color="#aaa" />
          <Text style={styles.noImageText}>No Image</Text>
        </View>
      )}

      {/* Animal Details */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{animal.name}</Text>

        <View style={styles.row}>
          <Text style={styles.label}>Tag:</Text>
          <Text style={styles.value}>{animal.tag || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Breed:</Text>
          <Text style={styles.value}>{animal.breed || 'Unknown'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Sex:</Text>
          <Text style={styles.value}>{animal.gender || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{animal.category || 'N/A'}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>DOB:</Text>
          <Text style={styles.value}>{animal.dob || 'N/A'}</Text>
        </View>

        {/* ⭐ FOR SALE TAG */}
        {animal.is_for_sale && (
          <View style={styles.forSaleTag}>
            <Text style={styles.forSaleText}>FOR SALE</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default AnimalCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: {width: 0, height: 3},
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },

  noImage: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    marginTop: 5,
    color: '#888',
    fontSize: 12,
  },

  infoContainer: {
    flex: 1,
    paddingLeft: 15,
    justifyContent: 'center',
  },

  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a3c34',
    marginBottom: 8,
  },

  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    width: 90,
    fontWeight: '600',
    color: '#666',
  },
  value: {
    color: '#333',
    flexShrink: 1,
  },

  /* ⭐ For Sale Tag */
  forSaleTag: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#333333',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  forSaleText: {
    color: '#ffa500',
    fontWeight: '700',
    fontSize: 12,
  },
});
