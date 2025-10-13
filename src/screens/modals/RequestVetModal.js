import React, {useState} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';

export default function RequestVetModal({visible, onClose, vet, onSubmit}) {
  const [message, setMessage] = useState('');
  const [signs, setSigns] = useState('');
  const [animalImage, setAnimalImage] = useState(null);

  if (!vet) return null;

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    });
    if (!result.didCancel && result.assets?.length > 0) {
      setAnimalImage(result.assets[0]);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Request Vet {vet.name ?? 'Vet'}</Text>

          {/* Signs input */}
          <Text style={styles.label}>Animal Signs / Symptoms</Text>
          <TextInput
            style={styles.input}
            placeholder="E.g. coughing, limping..."
            value={signs}
            onChangeText={setSigns}
            multiline
          />

          {/* Request details */}
          <Text style={styles.label}>Request Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter request details..."
            value={message}
            onChangeText={setMessage}
            multiline
          />

          {/* Image picker */}
          <TouchableOpacity style={styles.imageBtn} onPress={pickImage}>
            <Text style={styles.imageBtnText}>
              {animalImage ? 'Change Image' : 'Upload Animal Image'}
            </Text>
          </TouchableOpacity>

          {animalImage && (
            <Image
              source={{uri: animalImage.uri}}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, styles.cancel]}
              onPress={onClose}>
              <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.submit]}
              onPress={() => {
                onSubmit(vet, {message, signs, animalImage});
                setMessage('');
                setSigns('');
                setAnimalImage(null);
              }}>
              <Text style={[styles.btnText, {color: '#fff'}]}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    elevation: 6,
  },
  title: {fontSize: 18, fontWeight: '600', marginBottom: 12},
  label: {fontSize: 14, fontWeight: '500', marginTop: 10, marginBottom: 4},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    minHeight: 60,
    textAlignVertical: 'top',
    marginBottom: 8,
  },
  imageBtn: {
    backgroundColor: '#eee',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  imageBtnText: {fontWeight: '600', color: '#007bff'},
  previewImage: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    marginTop: 8,
  },
  actions: {flexDirection: 'row', justifyContent: 'flex-end', marginTop: 16},
  button: {paddingHorizontal: 14, paddingVertical: 8, borderRadius: 6},
  cancel: {backgroundColor: '#eee', marginRight: 8},
  submit: {backgroundColor: '#007bff'},
  btnText: {fontWeight: '600'},
});
