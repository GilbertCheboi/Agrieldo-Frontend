// File: src/services/api.js

import API from './axiosInstance'; // Configured Axios instance for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Helper function to get auth headers (with AsyncStorage token)
 */
const getAuthHeaders = async (isMultipart = false) => {
  const token = await AsyncStorage.getItem('access_token');
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      ...(isMultipart
        ? {'Content-Type': 'multipart/form-data'}
        : {'Content-Type': 'application/json'}),
    },
  };
};

/**
 * Fetch daily milk totals.
 * Optionally accepts start and end dates for filtering.
 */
export const fetchDailyTotals = async (startDate = null, endDate = null) => {
  try {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const headers = await getAuthHeaders();

    const response = await API.get('animals/daily-totals/', {
      ...headers,
      params,
    });

    console.log('✅ Fetched Daily Totals:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error fetching daily totals:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

/**
 * Fetch daily feed cost vs milk revenue for a specific farm.
 */
export const fetchDailyFeedVsMilkRevenue = async (
  farmId,
  startDate = null,
  endDate = null,
) => {
  try {
    const params = {};
    if (startDate) params.start_date = startDate;
    if (endDate) params.end_date = endDate;

    const headers = await getAuthHeaders();

    const response = await API.get(
      `animals/farms/${farmId}/daily-feed-vs-milk/`,
      {
        ...headers,
        params: Object.keys(params).length ? params : undefined,
      },
    );

    console.log('✅ Fetched Feed vs Milk Revenue:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error fetching daily feed vs milk revenue:',
      error.response ? error.response.data : error.message,
    );
    return [];
  }
};

export const fetchAnimals = async farmId => {
  try {
    const response = await API.get(
      `/farms/${farmId}/animals/`,
      getAuthHeaders(),
    );
    console.log(`Fetched Animals Data for farm ${farmId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching animals for farm ${farmId}:`,
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const createAnimal = async animalData => {
  try {
    const headers = await getAuthHeaders(animalData instanceof FormData);
    const response = await API.post('animals/add/', animalData, headers);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating animal:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};

export const addHealthRecord = async (animalId, data) => {
  return API.post(
    'animals/health-records/',
    {animal: animalId, ...data},
    getAuthHeaders(),
  );
};

export const updateHealthRecord = (recordId, formData) => {
  return API.put(
    `animals/health-records/${recordId}/`,
    formData,
    getAuthHeaders(),
  );
};

export const addReproductiveHistory = async (animalId, data) => {
  const payload = {animal: animalId, ...data};
  console.log('Reproductive History Payload:', payload); // Add this
  try {
    const response = await API.post(
      'animals/reproductive-history/',
      payload,
      getAuthHeaders(),
    );
    console.log('Add reproductive history response:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error adding reproductive history:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const updateReproductiveHistory = async (id, data) => {
  try {
    const response = await API.put(
      `animals/reproductive-history/${id}/`,
      data,
      getAuthHeaders(),
    );
    console.log('Updated reproductive history:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error updating reproductive history:',
      error.response ? error.response.data : error.message,
    );
    throw error;
  }
};

export const addLactationRecord = async (animalId, data) => {
  return API.post(`animals/lactation/${animalId}/`, data, getAuthHeaders());
};

export const updateLactationRecord = async (animalId, data) => {
  return API.put(`animals/lactation/${animalId}/edit`, data, getAuthHeaders());
};

export const addProductionData = async (animalId, data) => {
  return API.post(
    'animals/production-data/',
    {animal: animalId, ...data},
    getAuthHeaders(),
  );
};

export const updateProductionData = async (id, data) => {
  return API.put(`animals/production-data/${id}/edit`, data, getAuthHeaders());
};
