import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createAnimal, fetchAnimals} from '../utils/api';
import AddAnimalModal from '././modals/AddAnimalModal';
import AnimalTable from './tables/PaginatedAnimalTable';
import {FlatList} from 'react-native-gesture-handler';

// At the very top of your file:
const formatDateToISO = dob => {
  // 1) Already ISO‑hyphen (YYYY‑MM‑DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    return dob;
  }

  // 2) ISO‑slash (YYYY/MM/DD) → convert to hyphens
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(dob)) {
    return dob.replace(/\//g, '-');
  }

  // 3) European dd‑mm‑yyyy or dd/mm/yyyy → ISO
  const m = dob.match(/^(\d{2})[-\/](\d{2})[-\/](\d{4})$/);
  if (m) {
    const [, day, month, year] = m;
    return `${year}-${month}-${day}`;
  }

  // 4) Fallback (invalid or unexpected format)
  return dob;
};

const categories = [
  {label: 'Total Animals', icon: 'cow', key: 'totalCows'},
  {label: 'Bulls', icon: 'bullhorn', key: 'bulls', query: 'category=Bull'},
  {
    label: 'Heifers',
    icon: 'gender-female',
    key: 'heifers',
    query: 'category=Heifer',
  },
  {
    label: 'Calves (0-3)',
    icon: 'baby-bottle-outline',
    key: 'calves',
    query: 'category=Calf (0-3 months)',
  },
  {
    label: 'Weaner 1 (3-6)',
    icon: 'baby-bottle-outline',
    key: 'weanerStage1',
    query: 'category=Weaner Stage 1 (3-6 months)',
  },
  {
    label: 'Weaner 2 (6-9)',
    icon: 'baby-bottle-outline',
    key: 'weanerStage2',
    query: 'category=Weaner Stage 2 (6-9 months)',
  },
  {
    label: 'Yearlings (9-12)',
    icon: 'account-child',
    key: 'yearlings',
    query: 'category=Yearling (9-12 months)',
  },
  {
    label: 'Bulling (12-15)',
    icon: 'gender-female',
    key: 'bulling',
    query: 'category=Bulling (12-15 months)',
  },
  {
    label: 'In-Calf',
    icon: 'heart-plus-outline',
    key: 'inCalf',
    query: 'category=In-Calf',
  },
  {
    label: 'Steaming',
    icon: 'fire',
    key: 'steaming',
    query: 'category=Steaming',
  },
  {
    label: 'Early Lactating',
    icon: 'cow',
    key: 'earlyLactating',
    query: 'category=Early Lactating',
  },
  {
    label: 'Mid Lactating',
    icon: 'cow',
    key: 'midLactating',
    query: 'category=Mid Lactating',
  },
  {
    label: 'Late Lactating',
    icon: 'cow',
    key: 'lateLactating',
    query: 'category=Late Lactating',
  },
  {label: 'Dry', icon: 'grass', key: 'dry', query: 'category=Dry'},
  {
    label: 'Sick Animals',
    icon: 'medical-bag',
    key: 'sickCows',
    query: 'is_sick=true',
  },
];

const ViewAnimalsScreen = ({route}) => {
  const {farmId} = route.params || {};

  const [livestockData, setLivestockData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    tag: '',
    breed: '',
    gender: '',
    dob: '',
    category: '',
    farm: farmId,
    farms: [{id: farmId, name: `Farm #${farmId}`}],
    images: [],
  });
  const [formErrors, setFormErrors] = useState({});

  const handleFormChange = (name, value) => {
    setFormData(prev => ({...prev, [name]: value}));
  };

  const handleImageChange = imageFileList => {
    const safeArray = Array.isArray(imageFileList)
      ? imageFileList
      : [imageFileList];

    setFormData(prev => ({
      ...prev,
      images: safeArray,
    }));
  };

  const handleAddAnimal = async () => {
    const errors = {};
    if (!formData.name) errors.name = 'Animal name is required';
    if (!formData.tag) errors.tag = 'Tag is required';
    if (!formData.breed) errors.breed = 'Breed is required';
    if (!formData.dob) errors.dob = 'Date of birth is required';
    if (!formData.farm) errors.farm = 'Farm is required';

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    // Build FormData
    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('tag', formData.tag);
    payload.append('breed', formData.breed);
    // Format and append dob
    const isoDob = formatDateToISO(formData.dob);
    console.log('🎯 formatted DOB:', isoDob); // should now be "2020-09-09"
    payload.append('dob', isoDob);
    payload.append('gender', formData.gender);
    payload.append('category', formData.category);
    payload.append('farm', String(formData.farm));

    // Add images safely
    if (formData.images?.length) {
      formData.images.forEach((file, index) => {
        payload.append('images', {
          uri: file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`,
          type: file.type || 'image/jpeg',
          name: file.name || `photo_${index}.jpg`,
        });
      });
    }

    console.log('FORM DATA PREVIEW: ', payload._parts);

    try {
      await createAnimal(payload); // Uses axios, which handles boundary automatically
      setOpenModal(false); // close modal
      // reload animals
      const animals = await fetchAnimals(farmId);
      setLivestockData(prev => ({...prev, rawList: animals}));
    } catch (error) {
      console.error('Animal creation failed:', error);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  const handleCategoryClick = query => {
    console.log('Filter:', query);
  };

  useEffect(() => {
    const loadAnimals = async () => {
      try {
        const animals = await fetchAnimals(farmId);
        const summary = {
          totalCows: animals.length,
          bulls: 0,
          heifers: 0,
          sickCows: 0,
          calves: 0,
          weanerStage1: 0,
          weanerStage2: 0,
          yearlings: 0,
          bulling: 0,
          inCalf: 0,
          steaming: 0,
          earlyLactating: 0,
          midLactating: 0,
          lateLactating: 0,
          dry: 0,
        };

        animals.forEach(animal => {
          const cat = (animal.category || '').toLowerCase();
          if (animal.is_sick) summary.sickCows++;
          if (cat.includes('bull')) summary.bulls++;
          if (cat.includes('heifer')) summary.heifers++;
          if (cat.includes('calf')) summary.calves++;
          if (cat.includes('weaner stage 1')) summary.weanerStage1++;
          if (cat.includes('weaner stage 2')) summary.weanerStage2++;
          if (cat.includes('yearling')) summary.yearlings++;
          if (cat.includes('bulling')) summary.bulling++;
          if (cat.includes('in-calf')) summary.inCalf++;
          if (cat.includes('steaming')) summary.steaming++;
          if (cat.includes('early lactating')) summary.earlyLactating++;
          if (cat.includes('mid lactating')) summary.midLactating++;
          if (cat.includes('late lactating')) summary.lateLactating++;
          if (cat.includes('dry')) summary.dry++;
        });

        // setLivestockData(summary);
        setLivestockData({...summary, rawList: animals});
      } catch (error) {
        console.error('Failed to fetch livestock data', error);
      } finally {
        setLoading(false);
      }
    };

    loadAnimals();
  }, [farmId]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#ffa500" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={styles.header}>Livestock Summary</Text>
            <View style={styles.grid}>
              {categories.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.card}
                  onPress={() => handleCategoryClick(item.query || '')}>
                  <View style={styles.iconRow}>
                    <Icon
                      name={item.icon}
                      size={18}
                      color={item.key === 'sickCows' ? 'red' : '#ffa500'}
                      onLayout={() => console.log('Rendering icon:', item.icon)}
                    />
                    <Text style={styles.cardTitle}> {item.label}</Text>
                  </View>
                  <Text
                    style={[
                      styles.count,
                      item.key === 'sickCows' && {color: 'red'},
                    ]}>
                    {livestockData?.[item.key] ?? 0}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* Add Animal Card */}
              <TouchableOpacity
                style={styles.card}
                onPress={() => setOpenModal(true)}>
                <View style={styles.iconRow}>
                  <Icon name="plus" size={18} color="#ffa500" />
                  <Text style={styles.cardTitle}> Add Animal</Text>
                </View>
                <Text style={[styles.count, {color: '#ffa500'}]}>+</Text>
              </TouchableOpacity>
            </View>

            {/* Animal Table */}
            <AnimalTable animals={livestockData?.rawList || []} />
          </>
        }
        data={[]} // No actual list items needed here, we just use ListHeaderComponent
        renderItem={null}
        keyExtractor={() => 'empty'} // Avoid FlatList warning
      />

      {/* Add Animal Modal */}
      <AddAnimalModal
        visible={openModal}
        onClose={handleModalClose}
        formData={formData}
        formErrors={formErrors}
        handleFormChange={handleFormChange}
        handleAddAnimal={handleAddAnimal}
        handleImageChange={handleImageChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a3c34',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 4,
  },
  count: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ViewAnimalsScreen;
