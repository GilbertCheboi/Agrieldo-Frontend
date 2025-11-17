import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  LayoutAnimation,
  UIManager,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {createAnimal, fetchAnimals} from '../utils/api';
import AddAnimalModal from './modals/AddAnimalModal';
import AnimalTable from './tables/PaginatedAnimalTable';

// Enable animation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const formatDateToISO = dob => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dob)) return dob;
  if (/^\d{4}\/\d{2}\/\d{2}$/.test(dob)) return dob.replace(/\//g, '-');
  const m = dob.match(/^(\d{2})[-\/](\d{2})[-\/](\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return dob;
};

const categories = [
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
  const [expanded, setExpanded] = useState(false);

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

  const handleFormChange = (name, value) =>
    setFormData(prev => ({...prev, [name]: value}));

  const handleImageChange = imageFileList => {
    const safeArray = Array.isArray(imageFileList)
      ? imageFileList
      : [imageFileList];
    setFormData(prev => ({...prev, images: safeArray}));
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

    const payload = new FormData();
    payload.append('name', formData.name);
    payload.append('tag', formData.tag);
    payload.append('breed', formData.breed);
    payload.append('dob', formatDateToISO(formData.dob));
    payload.append('gender', formData.gender);
    payload.append('category', formData.category);
    payload.append('farm', String(formData.farm));

    if (formData.images?.length) {
      formData.images.forEach((file, index) => {
        payload.append('images', {
          uri: file.uri.startsWith('file://') ? file.uri : `file://${file.uri}`,
          type: file.type || 'image/jpeg',
          name: file.name || `photo_${index}.jpg`,
        });
      });
    }

    try {
      await createAnimal(payload);
      setOpenModal(false);
      const animals = await fetchAnimals(farmId);
      setLivestockData(prev => ({...prev, rawList: animals}));
    } catch (error) {
      console.error('Animal creation failed:', error);
    }
  };

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
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
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        contentContainerStyle={{padding: 16, paddingBottom: 60}}
        showsVerticalScrollIndicator={false}>
        {/* Livestock Summary Dropdown */}
        <TouchableOpacity style={styles.headerButton} onPress={toggleExpand}>
          <Text style={styles.headerButtonText}>Livestock Summary</Text>
          <Icon
            name={expanded ? 'chevron-up' : 'chevron-down'}
            size={22}
            color="#ffa500"
          />
        </TouchableOpacity>

        {expanded && (
          <View style={styles.grid}>
            {categories.map((item, index) => (
              <View key={index} style={styles.card}>
                <View style={styles.iconRow}>
                  <Icon
                    name={item.icon}
                    size={16}
                    color={item.key === 'sickCows' ? 'red' : '#ffa500'}
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
              </View>
            ))}
          </View>
        )}

        {/* Add Animal Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setOpenModal(true)}>
          <Icon name="plus" size={18} color="#fff" />
          <Text style={styles.addText}>Add Animal</Text>
        </TouchableOpacity>

        {/* Scrollable Animal List */}
        <AnimalTable animals={livestockData?.rawList || []} />
      </ScrollView>

      {/* Add Animal Modal */}
      <AddAnimalModal
        visible={openModal}
        onClose={() => setOpenModal(false)}
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
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  headerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#333333',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 2,
  },
  headerButtonText: {color: '#ffa500', fontWeight: 'bold', fontSize: 16},
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  card: {
    width: '48%',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    elevation: 2,
  },
  cardTitle: {fontSize: 12, fontWeight: '600', color: '#333', marginLeft: 4},
  count: {fontSize: 16, fontWeight: 'bold', color: '#000'},
  iconRow: {flexDirection: 'row', alignItems: 'center'},
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#3bca47ff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 6,
  },
  addText: {color: '#fff', fontWeight: 'bold', marginLeft: 6, fontSize: 14},
});

export default ViewAnimalsScreen;
