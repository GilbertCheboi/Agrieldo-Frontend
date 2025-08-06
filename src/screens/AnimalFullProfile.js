// import React, {useState} from 'react';
// import {View, Text, StyleSheet, ScrollView} from 'react-native';
// import AnimalCard from '../components/AnimalCard';
// import HealthRecords from '../components/HealthRecords';
// import ReproductiveHistory from '../components/ReproductiveHistory';
// import LactationRecords from '../components/LactationRecords';
// import DailyMilkProduction from '../components/DailyMilkProduction';

// import HealthRecordModal from './modals/HealthRecordModal';
// import ReproductiveRecordModal from './modals/ReproductiveRecordModal';
// import LactationRecordModal from './modals/LactationRecordModal';
// import MilkProductionModal from './modals/MilkProductionModal';
// import {
//   addHealthRecord,
//   addLactationRecord,
//   addProductionData,
//   addReproductiveHistory,
//   updateHealthRecord,
//   updateLactationRecord,
//   updateProductionData,
//   updateReproductiveHistory,
// } from '../utils/api';

// const canEdit = true;

// const AnimalFullProfile = ({route}) => {
//   const {animal} = route.params;

//   // Health
//   const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
//   const [isEditingHealth, setIsEditingHealth] = useState(false);
//   const [editingHealthRecordId, setEditingHealthRecordId] = useState(null);
//   const [healthForm, setHealthForm] = useState({
//     date: '',
//     type: '',
//     details: '',
//     is_sick: false,
//     clinical_signs: '',
//     diagnosis: '',
//     treatment: '',
//     cost: '',
//   });

//   const handleEditHealth = record => {
//     setIsEditingHealth(true);
//     setEditingHealthRecordId(record.id);
//     setHealthForm({
//       date: record.date || '',
//       type: record.type || '',
//       details: record.details || '',
//       is_sick: record.is_sick || false,
//       clinical_signs: record.clinical_signs || '',
//       diagnosis: record.diagnosis || '',
//       treatment: record.treatment || '',
//       cost: record.cost?.toString() || '',
//     });
//     setIsHealthModalOpen(true);
//   };

//   // Reproductive
//   const [isReproModalOpen, setIsReproModalOpen] = useState(false);
//   const [isEditingRepro, setIsEditingRepro] = useState(false);
//   const [editingReproId, setEditingReproId] = useState(null);
//   const [reproForm, setReproForm] = useState({
//     date: '',
//     event: '',
//     details: '',
//     cost: '',
//   });

//   const handleEditRepro = record => {
//     setIsEditingRepro(true);
//     setEditingReproId(record.id);
//     setReproForm({
//       date: record.date || '',
//       event: record.event || '',
//       details: record.details || '',
//       cost: record.cost?.toString() || '',
//     });
//     setIsReproModalOpen(true);
//   };

//   // Lactation
//   const [isLactationModalOpen, setIsLactationModalOpen] = useState(false);
//   const [isEditingLactation, setIsEditingLactation] = useState(false);
//   const [editingLactationId, setEditingLactationId] = useState(null);
//   const [lactationForm, setLactationForm] = useState({
//     lactation_number: '',
//     last_calving_date: '',
//     end_date: '',
//     is_milking: true,
//   });

//   const handleEditLactation = record => {
//     setIsEditingLactation(true);
//     setEditingLactationId(record.id);
//     setLactationForm({
//       lactation_number: record.lactation_number || '',
//       last_calving_date: record.last_calving_date || '',
//       end_date: record.end_date || '',
//       is_milking: record.is_milking || false,
//     });
//     setIsLactationModalOpen(true);
//   };

//   // Milk production
//   const [isMilkModalOpen, setIsMilkModalOpen] = useState(false);
//   const [isEditingMilk, setIsEditingMilk] = useState(false);
//   const [editingMilkId, setEditingMilkId] = useState(null);
//   const [milkForm, setMilkForm] = useState({
//     date: '',
//     session: '',
//     milk_yield: '',
//     milk_price_per_liter: '',
//     feed_consumption: '',
//     scc: '',
//     fat_percentage: '',
//     protein_percentage: '',
//   });

//   const handleEditMilk = record => {
//     setIsEditingMilk(true);
//     setEditingMilkId(record.id);
//     setMilkForm({
//       date: record.date || '',
//       session: record.session || '',
//       milk_yield: record.milk_yield?.toString() || '',
//       milk_price_per_liter: record.milk_price_per_liter?.toString() || '',
//       feed_consumption: record.feed_consumption?.toString() || '',
//       scc: record.scc?.toString() || '',
//       fat_percentage: record.fat_percentage?.toString() || '',
//       protein_percentage: record.protein_percentage?.toString() || '',
//     });
//     setIsMilkModalOpen(true);
//   };

//   return (
//     <ScrollView
//       style={styles.container}
//       contentContainerStyle={styles.contentContainer}>
//       <Text style={styles.title}>{animal.name}'s Full Profile</Text>

//       <AnimalCard animal={animal} />

//       <SectionDivider title="Health Records" />
//       <HealthRecords
//         healthRecords={animal.health_records}
//         setIsHealthModalOpen={setIsHealthModalOpen}
//         setIsEditingHealth={setIsEditingHealth}
//         setHealthForm={setHealthForm}
//         handleEditHealth={handleEditHealth}
//         canEdit={canEdit}
//       />
//       <HealthRecordModal
//         visible={isHealthModalOpen}
//         onClose={() => {
//           setIsHealthModalOpen(false);
//           setEditingHealthRecordId(null);
//           setIsEditingHealth(false);
//         }}
//         isEditing={isEditingHealth}
//         healthForm={healthForm}
//         setHealthForm={setHealthForm}
//         onSave={async () => {
//           try {
//             if (isEditingHealth && editingHealthRecordId) {
//               await updateHealthRecord(editingHealthRecordId, {
//                 ...healthForm,
//                 animal: animal.id,
//               });
//               console.log('Health record updated successfully');
//             } else {
//               await addHealthRecord(animal.id, healthForm);
//               console.log('Health record added successfully');
//             }
//             setIsHealthModalOpen(false);
//             setEditingHealthRecordId(null);
//             setIsEditingHealth(false);
//           } catch (error) {
//             console.error(
//               'Error saving health record:',
//               error.response?.data || error.message,
//             );
//           }
//         }}
//       />

//       <SectionDivider title="Reproductive History" />
//       <ReproductiveHistory
//         records={animal.reproductive_history}
//         setIsReproModalOpen={setIsReproModalOpen}
//         setIsEditingRepro={setIsEditingRepro}
//         setReproForm={setReproForm}
//         handleEditRepro={handleEditRepro}
//         canEdit={canEdit}
//       />
//       <ReproductiveRecordModal
//         visible={isReproModalOpen}
//         onClose={() => {
//           setIsReproModalOpen(false);
//           setIsEditingRepro(false);
//           setEditingReproId(null);
//         }}
//         isEditing={isEditingRepro}
//         form={reproForm}
//         setForm={setReproForm}
//         onSave={async () => {
//           try {
//             if (isEditingRepro && editingReproId) {
//               await updateReproductiveHistory(editingReproId, {
//                 ...reproForm,
//                 animal: animal.id,
//               });
//               console.log('Reproductive history updated successfully');
//             } else {
//               await addReproductiveHistory(animal.id, reproForm);
//               console.log('Reproductive history added successfully');
//             }

//             setIsReproModalOpen(false);
//             setIsEditingRepro(false);
//             setEditingReproId(null);
//             // TODO: refresh animal records if needed
//           } catch (error) {
//             console.error(
//               'Error saving reproductive history:',
//               error.response?.data || error.message,
//             );
//           }
//         }}
//       />

//       <SectionDivider title="Lactation Records" />
//       <LactationRecords
//         records={animal.lactation_periods}
//         setIsLactationModalOpen={setIsLactationModalOpen}
//         setIsEditingLactation={setIsEditingLactation}
//         setLactationForm={setLactationForm}
//         handleEditLactation={handleEditLactation}
//         canEdit={canEdit}
//       />
//       <LactationRecordModal
//         visible={isLactationModalOpen}
//         onClose={() => {
//           setIsLactationModalOpen(false);
//           setEditingLactationId(null);
//           setIsEditingLactation(false);
//         }}
//         isEditing={isEditingLactation}
//         form={lactationForm}
//         setForm={setLactationForm}
//         onSave={async () => {
//           try {
//             console.log(
//               `${isEditingLactation ? 'Updating' : 'Saving'} lactation record`,
//               lactationForm,
//             );

//             if (isEditingLactation && editingLactationId) {
//               await updateLactationRecord(editingLactationId, {
//                 ...lactationForm,
//                 animal: animal.id,
//               });
//               console.log('Lactation record updated successfully');
//             } else {
//               await addLactationRecord(animal.id, lactationForm);
//               console.log('Lactation record added successfully');
//             }

//             setIsLactationModalOpen(false);
//             setEditingLactationId(null);
//             setIsEditingLactation(false);

//             // Optionally refresh records
//           } catch (error) {
//             console.error(
//               `Error ${
//                 isEditingLactation ? 'updating' : 'adding'
//               } lactation record:`,
//               error.response?.data || error.message,
//             );
//           }
//         }}
//       />

//       <SectionDivider title="Daily Milk Production" />
//       <DailyMilkProduction
//         records={animal.production_data}
//         setIsMilkModalOpen={setIsMilkModalOpen}
//         setIsEditingMilk={setIsEditingMilk}
//         setMilkForm={setMilkForm}
//         handleEditMilk={handleEditMilk}
//         canEdit={canEdit}
//       />
//       <MilkProductionModal
//         visible={isMilkModalOpen}
//         onClose={() => {
//           setIsMilkModalOpen(false);
//           setEditingMilkId(null);
//           setIsEditingMilk(false);
//         }}
//         isEditing={isEditingMilk}
//         form={milkForm}
//         setForm={setMilkForm}
//         onSave={async () => {
//           try {
//             console.log('Saving milk production record:', milkForm);

//             if (isEditingMilk && editingMilkId) {
//               await updateProductionData(editingMilkId, {
//                 ...milkForm,
//                 animal: animal.id,
//               });
//               console.log('Milk production record updated successfully');
//             } else {
//               await addProductionData(animal.id, milkForm);
//               console.log('Milk production record added successfully');
//             }

//             setIsMilkModalOpen(false);
//             setEditingMilkId(null);
//             setIsEditingMilk(false);
//             // Optionally refresh the animal profile or fetch updated production data
//           } catch (error) {
//             console.error(
//               'Error saving milk production record:',
//               error.response?.data || error.message,
//             );
//             // Optionally show a user-friendly error message
//           }
//         }}
//       />
//     </ScrollView>
//   );
// };

// // 🔽 Section Divider Component
// const SectionDivider = ({title}) => (
//   <View style={styles.dividerContainer}>
//     <Text style={styles.sectionTitle}>{title}</Text>
//     <View style={styles.divider} />
//   </View>
// );

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//     backgroundColor: '#fff',
//   },
//   contentContainer: {
//     paddingBottom: 20,
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 20,
//     marginBottom: 16,
//     color: '#1a3c34',
//     textAlign: 'center',
//   },
//   dividerContainer: {
//     marginVertical: 20,
//   },
//   sectionTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//     marginBottom: 6,
//   },
//   divider: {
//     height: 1,
//     backgroundColor: '#ccc',
//     marginBottom: 4,
//   },
// });

// export default AnimalFullProfile;

import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AnimalCard from '../components/AnimalCard';
import HealthRecords from '../components/HealthRecords';
import ReproductiveHistory from '../components/ReproductiveHistory';
import LactationRecords from '../components/LactationRecords';
import DailyMilkProduction from '../components/DailyMilkProduction';

import HealthRecordModal from './modals/HealthRecordModal';
import ReproductiveRecordModal from './modals/ReproductiveRecordModal';
import LactationRecordModal from './modals/LactationRecordModal';
import MilkProductionModal from './modals/MilkProductionModal';

import {
  addHealthRecord,
  addLactationRecord,
  addProductionData,
  addReproductiveHistory,
  updateHealthRecord,
  updateLactationRecord,
  updateProductionData,
  updateReproductiveHistory,
} from '../utils/api';

const tabs = [
  {key: 'health', label: 'Health Records'},
  {key: 'repro', label: 'Reproductive History'},
  {key: 'lactation', label: 'Lactation Records'},
  {key: 'milk', label: 'Daily Milk Production'},
];

const canEdit = true;

const AnimalFullProfile = ({route}) => {
  const {animal} = route.params;

  const [activeTab, setActiveTab] = useState('health');

  // --- Health ---
  const [isHealthModalOpen, setIsHealthModalOpen] = useState(false);
  const [isEditingHealth, setIsEditingHealth] = useState(false);
  const [editingHealthRecordId, setEditingHealthRecordId] = useState(null);
  const [healthForm, setHealthForm] = useState({
    date: '',
    type: '',
    details: '',
    is_sick: false,
    clinical_signs: '',
    diagnosis: '',
    treatment: '',
    cost: '',
  });

  const handleEditHealth = record => {
    setIsEditingHealth(true);
    setEditingHealthRecordId(record.id);
    setHealthForm({
      date: record.date || '',
      type: record.type || '',
      details: record.details || '',
      is_sick: record.is_sick || false,
      clinical_signs: record.clinical_signs || '',
      diagnosis: record.diagnosis || '',
      treatment: record.treatment || '',
      cost: record.cost?.toString() || '',
    });
    setIsHealthModalOpen(true);
  };

  // --- Reproductive ---
  const [isReproModalOpen, setIsReproModalOpen] = useState(false);
  const [isEditingRepro, setIsEditingRepro] = useState(false);
  const [editingReproId, setEditingReproId] = useState(null);
  const [reproForm, setReproForm] = useState({
    date: '',
    event: '',
    details: '',
    cost: '',
  });

  const handleEditRepro = record => {
    setIsEditingRepro(true);
    setEditingReproId(record.id);
    setReproForm({
      date: record.date || '',
      event: record.event || '',
      details: record.details || '',
      cost: record.cost?.toString() || '',
    });
    setIsReproModalOpen(true);
  };

  // --- Lactation ---
  const [isLactationModalOpen, setIsLactationModalOpen] = useState(false);
  const [isEditingLactation, setIsEditingLactation] = useState(false);
  const [editingLactationId, setEditingLactationId] = useState(null);
  const [lactationForm, setLactationForm] = useState({
    lactation_number: '',
    last_calving_date: '',
    end_date: '',
    is_milking: true,
  });

  const handleEditLactation = record => {
    setIsEditingLactation(true);
    setEditingLactationId(record.id);
    setLactationForm({
      lactation_number: record.lactation_number || '',
      last_calving_date: record.last_calving_date || '',
      end_date: record.end_date || '',
      is_milking: record.is_milking || false,
    });
    setIsLactationModalOpen(true);
  };

  // --- Milk Production ---
  const [isMilkModalOpen, setIsMilkModalOpen] = useState(false);
  const [isEditingMilk, setIsEditingMilk] = useState(false);
  const [editingMilkId, setEditingMilkId] = useState(null);
  const [milkForm, setMilkForm] = useState({
    date: '',
    session: '',
    milk_yield: '',
    milk_price_per_liter: '',
    feed_consumption: '',
    scc: '',
    fat_percentage: '',
    protein_percentage: '',
  });

  const handleEditMilk = record => {
    setIsEditingMilk(true);
    setEditingMilkId(record.id);
    setMilkForm({
      date: record.date || '',
      session: record.session || '',
      milk_yield: record.milk_yield?.toString() || '',
      milk_price_per_liter: record.milk_price_per_liter?.toString() || '',
      feed_consumption: record.feed_consumption?.toString() || '',
      scc: record.scc?.toString() || '',
      fat_percentage: record.fat_percentage?.toString() || '',
      protein_percentage: record.protein_percentage?.toString() || '',
    });
    setIsMilkModalOpen(true);
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'health':
        return (
          <HealthRecords
            healthRecords={animal.health_records}
            setIsHealthModalOpen={setIsHealthModalOpen}
            setIsEditingHealth={setIsEditingHealth}
            setHealthForm={setHealthForm}
            handleEditHealth={handleEditHealth}
            canEdit={canEdit}
          />
        );
      case 'repro':
        return (
          <ReproductiveHistory
            records={animal.reproductive_history}
            setIsReproModalOpen={setIsReproModalOpen}
            setIsEditingRepro={setIsEditingRepro}
            setReproForm={setReproForm}
            handleEditRepro={handleEditRepro}
            canEdit={canEdit}
          />
        );
      case 'lactation':
        return (
          <LactationRecords
            records={animal.lactation_periods}
            setIsLactationModalOpen={setIsLactationModalOpen}
            setIsEditingLactation={setIsEditingLactation}
            setLactationForm={setLactationForm}
            handleEditLactation={handleEditLactation}
            canEdit={canEdit}
          />
        );
      case 'milk':
        return (
          <DailyMilkProduction
            records={animal.production_data}
            setIsMilkModalOpen={setIsMilkModalOpen}
            setIsEditingMilk={setIsEditingMilk}
            setMilkForm={setMilkForm}
            handleEditMilk={handleEditMilk}
            canEdit={canEdit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{animal.name}'s Full Profile</Text>
      <AnimalCard animal={animal} />

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tabItem, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <View style={{flex: 1, marginBottom: 40}}>{renderSection()}</View>

      {/* Modals */}
      <HealthRecordModal
        visible={isHealthModalOpen}
        onClose={() => {
          setIsHealthModalOpen(false);
          setEditingHealthRecordId(null);
          setIsEditingHealth(false);
        }}
        isEditing={isEditingHealth}
        healthForm={healthForm}
        setHealthForm={setHealthForm}
        onSave={async () => {
          try {
            if (isEditingHealth && editingHealthRecordId) {
              await updateHealthRecord(editingHealthRecordId, {
                ...healthForm,
                animal: animal.id,
              });
            } else {
              await addHealthRecord(animal.id, healthForm);
            }
            setIsHealthModalOpen(false);
            setEditingHealthRecordId(null);
            setIsEditingHealth(false);
          } catch (error) {
            console.error(
              'Error saving health record:',
              error.response?.data || error.message,
            );
          }
        }}
      />

      <ReproductiveRecordModal
        visible={isReproModalOpen}
        onClose={() => {
          setIsReproModalOpen(false);
          setIsEditingRepro(false);
          setEditingReproId(null);
        }}
        isEditing={isEditingRepro}
        form={reproForm}
        setForm={setReproForm}
        onSave={async () => {
          try {
            if (isEditingRepro && editingReproId) {
              await updateReproductiveHistory(editingReproId, {
                ...reproForm,
                animal: animal.id,
              });
            } else {
              await addReproductiveHistory(animal.id, reproForm);
            }
            setIsReproModalOpen(false);
            setIsEditingRepro(false);
            setEditingReproId(null);
          } catch (error) {
            console.error(
              'Error saving reproductive history:',
              error.response?.data || error.message,
            );
          }
        }}
      />

      <LactationRecordModal
        visible={isLactationModalOpen}
        onClose={() => {
          setIsLactationModalOpen(false);
          setEditingLactationId(null);
          setIsEditingLactation(false);
        }}
        isEditing={isEditingLactation}
        form={lactationForm}
        setForm={setLactationForm}
        onSave={async () => {
          try {
            if (isEditingLactation && editingLactationId) {
              await updateLactationRecord(editingLactationId, {
                ...lactationForm,
                animal: animal.id,
              });
            } else {
              await addLactationRecord(animal.id, lactationForm);
            }
            setIsLactationModalOpen(false);
            setEditingLactationId(null);
            setIsEditingLactation(false);
          } catch (error) {
            console.error(
              `Error saving lactation record:`,
              error.response?.data || error.message,
            );
          }
        }}
      />

      <MilkProductionModal
        visible={isMilkModalOpen}
        onClose={() => {
          setIsMilkModalOpen(false);
          setEditingMilkId(null);
          setIsEditingMilk(false);
        }}
        isEditing={isEditingMilk}
        form={milkForm}
        setForm={setMilkForm}
        onSave={async () => {
          try {
            if (isEditingMilk && editingMilkId) {
              await updateProductionData(editingMilkId, {
                ...milkForm,
                animal: animal.id,
              });
            } else {
              await addProductionData(animal.id, milkForm);
            }
            setIsMilkModalOpen(false);
            setEditingMilkId(null);
            setIsEditingMilk(false);
          } catch (error) {
            console.error(
              'Error saving milk production record:',
              error.response?.data || error.message,
            );
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  title: {
    fontWeight: 'bold',
    fontSize: 20,
    margin: 16,
    textAlign: 'center',
    color: '#1a3c34',
  },
  tabContainer: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingVertical: 8,
    marginBottom: 10,
  },
  tabItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
  },
  activeTab: {
    backgroundColor: '#1a3c34',
  },
  tabText: {
    fontSize: 14,
    color: '#333',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
});

export default AnimalFullProfile;
