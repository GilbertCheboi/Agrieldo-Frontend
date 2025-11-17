// AnimalFullProfile.js

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
import FinancialOverview from './FinancialOverview';

import HealthRecordModal from './modals/HealthRecordModal';
import ReproductiveRecordModal from './modals/ReproductiveRecordModal';
import LactationRecordModal from './modals/LactationRecordModal';
import MilkProductionModal from './modals/MilkProductionModal';

import {
  addHealthRecord,
  addLactationRecord,
  addProductionData,
  addReproductiveHistory,
  deleteHealthRecord,
  updateHealthRecord,
  updateLactationRecord,
  updateProductionData,
  updateReproductiveHistory,
  fetchAnimals,
} from '../utils/api';

const tabs = [
  {key: 'health', label: 'Health Records'},
  {key: 'repro', label: 'Reproductive History'},
  {key: 'lactation', label: 'Lactation Records'},
  {key: 'milk', label: 'Daily Milk Production'},
  {key: 'financial', label: 'Financial Overview'},
];

const canEdit = true;

const AnimalFullProfile = ({route, navigation}) => {
  const {animal} = route.params;
  const [activeTab, setActiveTab] = useState('health');
  const [currentAnimal, setCurrentAnimal] = useState(animal);

  // === Health Records State ===
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

  const refreshAnimalData = async () => {
    try {
      const animals = await fetchAnimals(currentAnimal.farm);
      const updated = animals.find(a => a.id === currentAnimal.id);
      if (updated) setCurrentAnimal(updated);
    } catch (err) {
      console.error('Failed to refresh animal data:', err.message);
    }
  };

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

  const handleDeleteHealth = async recordId => {
    try {
      await deleteHealthRecord(recordId);
      await refreshAnimalData();
    } catch (error) {
      console.error(
        'Error deleting health record:',
        error.response?.data || error.message,
      );
    }
  };

  // === Reproduction ===
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

  // === Lactation ===
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

  // === Milk Production ===
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

  // === Financial Overview ===
  const computeFinancialData = () => {
    const healthCost = currentAnimal.health_records?.reduce(
      (sum, r) => sum + (parseFloat(r.cost) || 0),
      0,
    );

    const reproCost = currentAnimal.reproductive_history?.reduce(
      (sum, r) => sum + (parseFloat(r.cost) || 0),
      0,
    );

    const lactationCost = currentAnimal.lactation_periods?.reduce(
      (sum, r) => sum + (parseFloat(r.cost) || 0),
      0,
    );

    const feedCost = currentAnimal.production_data?.reduce(
      (sum, r) => sum + (parseFloat(r.feed_consumption) || 0) * 50,
      0,
    );

    const milkRevenue = currentAnimal.production_data?.reduce(
      (sum, r) =>
        sum +
        (parseFloat(r.milk_yield) || 0) *
          (parseFloat(r.milk_price_per_liter) || 0),
      0,
    );

    const financialChartData = [
      {name: 'Feed', value: feedCost},
      {name: 'Health', value: healthCost},
      {name: 'Reproduction', value: reproCost},
      {name: 'Lactation', value: lactationCost},
      {name: 'Milk Revenue', value: milkRevenue},
    ];

    return {
      financialChartData,
      totalCost:
        feedCost + healthCost + reproCost + lactationCost + milkRevenue,
    };
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'health':
        return (
          <HealthRecords
            healthRecords={currentAnimal.health_records}
            setIsHealthModalOpen={setIsHealthModalOpen}
            setIsEditingHealth={setIsEditingHealth}
            setHealthForm={setHealthForm}
            handleEditHealth={handleEditHealth}
            handleDeleteHealth={handleDeleteHealth}
            canEdit={canEdit}
          />
        );

      case 'repro':
        return (
          <ReproductiveHistory
            records={currentAnimal.reproductive_history}
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
            records={currentAnimal.lactation_periods}
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
            records={currentAnimal.production_data}
            setIsMilkModalOpen={setIsMilkModalOpen}
            setIsEditingMilk={setIsEditingMilk}
            setMilkForm={setMilkForm}
            handleEditMilk={handleEditMilk}
            canEdit={canEdit}
          />
        );

      case 'financial': {
        const {financialChartData, totalCost} = computeFinancialData();
        return (
          <FinancialOverview
            financialChartData={financialChartData}
            totalCost={totalCost}
            darkMode={false}
          />
        );
      }

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{currentAnimal.name}'s Full Profile</Text>

      <AnimalCard animal={currentAnimal} />

      {/* ⭐ MARK FOR SALE BUTTON */}
      <TouchableOpacity
        style={styles.saleButton}
        onPress={() =>
          navigation.navigate('SellAnimal', {
            animalId: currentAnimal.id,
            animal: currentAnimal,
          })
        }>
        <Text style={styles.saleButtonText}>Mark for Sale</Text>
      </TouchableOpacity>

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

      {/* === ALL MODALS BELOW === */}

      {/* ==========================
          FAST CLOSE HEALTH MODAL
      =========================== */}
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
          const payload = {...healthForm, animal: currentAnimal.id};

          // CLOSE FAST
          setIsHealthModalOpen(false);
          setIsEditingHealth(false);
          setEditingHealthRecordId(null);

          try {
            if (isEditingHealth && editingHealthRecordId) {
              await updateHealthRecord(editingHealthRecordId, payload);
            } else {
              await addHealthRecord(currentAnimal.id, payload);
            }
            refreshAnimalData();
          } catch (error) {
            console.error(
              'Error saving:',
              error.response?.data || error.message,
            );
          }
        }}
      />

      {/* ==========================
          FAST CLOSE REPRO MODAL
      =========================== */}
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
          const payload = {...reproForm, animal: currentAnimal.id};

          // CLOSE FAST
          setIsReproModalOpen(false);
          setIsEditingRepro(false);
          setEditingReproId(null);

          try {
            if (isEditingRepro && editingReproId) {
              await updateReproductiveHistory(editingReproId, payload);
            } else {
              await addReproductiveHistory(currentAnimal.id, payload);
            }
            refreshAnimalData();
          } catch (error) {
            console.error(
              'Error saving:',
              error.response?.data || error.message,
            );
          }
        }}
      />

      {/* ==========================
          FAST CLOSE LACTATION MODAL
      =========================== */}
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
          const payload = {...lactationForm, animal: currentAnimal.id};

          // CLOSE FAST
          setIsLactationModalOpen(false);
          setIsEditingLactation(false);
          setEditingLactationId(null);

          try {
            if (isEditingLactation && editingLactationId) {
              await updateLactationRecord(editingLactationId, payload);
            } else {
              await addLactationRecord(currentAnimal.id, payload);
            }
            refreshAnimalData();
          } catch (error) {
            console.error(
              'Error saving:',
              error.response?.data || error.message,
            );
          }
        }}
      />

      {/* ==========================
          FAST CLOSE MILK MODAL
      =========================== */}
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
          const payload = {...milkForm, animal: currentAnimal.id};

          // CLOSE FAST
          setIsMilkModalOpen(false);
          setIsEditingMilk(false);
          setEditingMilkId(null);

          try {
            if (isEditingMilk && editingMilkId) {
              await updateProductionData(editingMilkId, payload);
            } else {
              await addProductionData(currentAnimal.id, payload);
            }
            refreshAnimalData();
          } catch (error) {
            console.error(
              'Error saving:',
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

  /* ⭐ SALE BUTTON */
  saleButton: {
    backgroundColor: '#333333',
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  saleButtonText: {
    color: '#ffa500',
    fontSize: 16,
    fontWeight: '700',
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
});

export default AnimalFullProfile;
