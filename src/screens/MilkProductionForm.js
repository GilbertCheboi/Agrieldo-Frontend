import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {fetchLactatingAnimals, addMilkProductionRecords} from '../utils/api';

const MilkProductionForm = ({onClose}) => {
  const [lactatingAnimals, setLactatingAnimals] = useState([]);
  const [entries, setEntries] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [session, setSession] = useState('MORNING');
  const [milkPrice, setMilkPrice] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnimals() {
      try {
        const data = await fetchLactatingAnimals();
        setLactatingAnimals(data);

        // 🔹 Initialize entries without feed field
        setEntries(
          data.map(animal => ({
            animal: animal.id,
            animal_name: animal.name,
            date,
            session: 'MORNING',
            milk_yield: '',
            scc: '',
            fat_percentage: '',
            protein_percentage: '',
            milk_price_per_liter: '',
          })),
        );
      } catch (err) {
        console.error('Error fetching animals:', err);
        Alert.alert('Error', 'Failed to load animals.');
      } finally {
        setLoading(false);
      }
    }
    loadAnimals();
  }, [date]);

  const handleChange = (index, field, value) => {
    setEntries(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const cleaned = entries.map(e => ({
        ...e,
        session,
        date,
        milk_yield: Number(e.milk_yield) || 0,

        // 🔹 OPTIONAL fields → send null if empty
        scc: e.scc ? Number(e.scc) : null,
        fat_percentage: e.fat_percentage ? Number(e.fat_percentage) : null,
        protein_percentage: e.protein_percentage
          ? Number(e.protein_percentage)
          : null,

        milk_price_per_liter: Number(milkPrice) || 0,
      }));

      await addMilkProductionRecords(cleaned);
      Alert.alert('✅ Success', 'Milk records saved successfully!');
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      Alert.alert('❌ Error', 'Failed to save records.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ffa500" />
        <Text style={{marginTop: 10, color: '#333'}}>Loading animals...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Record Milk Production</Text>

      {/* Date */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Date</Text>
        <TextInput
          value={date}
          onChangeText={setDate}
          style={styles.input}
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#888" // 👈 Added
        />
      </View>

      {/* Session */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Session</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={session}
            onValueChange={val => setSession(val)}
            style={{color: session === '' ? '#888' : '#000'}} // 👈 Fix placeholder visibility
            dropdownIconColor="#888">
            <Picker.Item label="-- Select Session --" value="" color="#888" />
            <Picker.Item label="Morning" value="MORNING" />
            <Picker.Item label="Afternoon" value="AFTERNOON" />
            <Picker.Item label="Evening" value="EVENING" />
          </Picker>
        </View>
      </View>

      {/* Milk Price */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Milk Price per Liter</Text>
        <TextInput
          value={milkPrice}
          onChangeText={setMilkPrice}
          keyboardType="numeric"
          style={styles.input}
          placeholder="Enter price in KES"
          placeholderTextColor="#888" // 👈 Added
        />
      </View>

      <Text style={styles.sectionTitle}>Animals</Text>

      {entries.length === 0 ? (
        <Text style={styles.noDataText}>No lactating animals found.</Text>
      ) : (
        entries.map((entry, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.animalName}>{entry.animal_name}</Text>

            {/* Only Milk, SCC, Fat %, Protein % */}
            <View style={styles.row}>
              <View style={styles.column}>
                <TextInput
                  placeholder="Milk Yield (L)"
                  placeholderTextColor="#888" // 👈 Added
                  keyboardType="numeric"
                  value={entry.milk_yield}
                  onChangeText={val => handleChange(index, 'milk_yield', val)}
                  style={styles.inputSmall}
                />

                <TextInput
                  placeholder="SCC (optional)"
                  placeholderTextColor="#888" // 👈 Added
                  keyboardType="numeric"
                  value={entry.scc}
                  onChangeText={val => handleChange(index, 'scc', val)}
                  style={styles.inputSmall}
                />

                <TextInput
                  placeholder="Fat % (optional)"
                  placeholderTextColor="#888" // 👈 Added
                  keyboardType="numeric"
                  value={entry.fat_percentage}
                  onChangeText={val =>
                    handleChange(index, 'fat_percentage', val)
                  }
                  style={styles.inputSmall}
                />
                <TextInput
                  placeholder="Protein % (optional)"
                  placeholderTextColor="#888" // 👈 Added
                  keyboardType="numeric"
                  value={entry.protein_percentage}
                  onChangeText={val =>
                    handleChange(index, 'protein_percentage', val)
                  }
                  style={styles.inputSmall}
                />
              </View>
            </View>
          </View>
        ))
      )}

      {/* Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
          <Text style={styles.btnText}>Cancel</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          style={styles.submitBtn}
          disabled={isSubmitting}>
          <Text style={styles.btnText}>
            {isSubmitting ? 'Saving...' : 'Save Records'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{height: 50}} />
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {flex: 1, padding: 16, backgroundColor: '#f9f9f9'},
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffa500',
    marginBottom: 14,
    textAlign: 'center',
  },
  label: {fontWeight: 'bold', marginBottom: 4, color: '#333'},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#ffa500',
  },
  inputGroup: {marginBottom: 12},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    color: '#000',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  animalName: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#ffa500',
    marginBottom: 6,
  },
  row: {flexDirection: 'row', justifyContent: 'space-between'},
  column: {flex: 1},
  inputSmall: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
    color: '#000',
    marginHorizontal: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 6,
    alignItems: 'center',
  },
  submitBtn: {
    backgroundColor: '#ffa500',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 6,
    alignItems: 'center',
  },
  btnText: {color: '#fff', fontWeight: 'bold', fontSize: 16},
  noDataText: {textAlign: 'center', color: '#888', marginTop: 20},
  center: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default MilkProductionForm;
