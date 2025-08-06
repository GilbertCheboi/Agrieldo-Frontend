// screens/FarmDashboard.js
import React from 'react';
import {View} from 'react-native';
import PaginatedAnimalTable from '../components/PaginatedAnimalTable';

const FarmDashboard = ({navigation}) => {
  const animals = [
    /* array of animal objects from API or props */
  ];

  return <PaginatedAnimalTable animals={animals} navigation={navigation} />;
};

export default FarmDashboard;
