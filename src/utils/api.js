// File: src/services/api.js

import API from './axiosInstance'; // Configured Axios instance for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

const FARMS_URL = 'http://192.168.100.4:8000/api/farms/farms/';
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

    console.log('Fetched Daily Totals:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching daily totals:',
      error.response ? error.response.data : error.message,
    );
    // Return empty array on failure (caller should handle empty data)
    return [];
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
  // Guard: if farmId is missing, don't call the API
  if (!farmId) {
    console.warn(
      'fetchDailyFeedVsMilkRevenue called without farmId — returning empty array',
    );
    return [];
  }

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

    console.log('Fetched Feed vs Milk Revenue:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching daily feed vs milk revenue:',
      error.response ? error.response.data : error.message,
    );
    // On error, return empty array so callers can safely handle no-data case
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

export const deleteHealthRecord = async recordId => {
  try {
    const response = await API.delete(`/animals/health-records/${recordId}/`);
    return response.data;
  } catch (error) {
    console.error(
      'Error deleting health record:',
      error.response?.data || error.message,
    );
    throw error;
  }
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

// export const addNewFarm = async data => {
//   return API.post('farms/farms/', data, getAuthHeaders());
// };

/**
 * Adds a new farm. Calls the endpoint exactly once per invocation.
 * - If image is provided, sends multipart/form-data (no Content-Type header set).
 * - Otherwise sends JSON.
 */
export const addNewFarm = async ({name, location, type, image}) => {
  const token = await AsyncStorage.getItem('access_token');
  console.log('[addNewFarm] token present?', !!token);
  console.log('[addNewFarm] image uri:', image?.uri);

  // Build request options once
  let options = {
    method: 'POST',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      Accept: 'application/json',
    },
  };

  // Only one fetch call will be made below
  if (image?.uri) {
    const formData = new FormData();
    formData.append('name', name);
    if (location) formData.append('location', location);
    if (type) formData.append('type', type);

    formData.append('image', {
      uri: image.uri,
      name: image.fileName || 'farm.jpg',
      type: image.type || 'image/jpeg',
    });

    options.body = formData;
    // DO NOT set 'Content-Type' here — let runtime set boundary
  } else {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify({name, location, type});
  }

  // single fetch call
  const response = await fetch(FARMS_URL, options);

  if (!response.ok) {
    const text = await response.text().catch(() => null);
    console.error('[addNewFarm] server error response:', response.status, text);
    throw new Error(`Server responded with ${response.status}`);
  }

  const data = await response.json();
  console.log('addNewFarm response:', data);
  return data;
};

export const updateFarm = async (id, formData) => {
  const token = await AsyncStorage.getItem('access_token');
  console.log('[updateFarm] token present?', !!token);

  const response = await fetch(`${FARMS_URL}${id}/`, {
    method: 'PUT', // use PUT if you want full replace
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      Accept: 'application/json',
      // Do NOT set Content-Type, fetch will add boundary for FormData
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => null);
    console.error('[updateFarm] server error response:', response.status, text);
    throw new Error(`Server responded with ${response.status}`);
  }

  const data = await response.json();
  console.log('[updateFarm] success response:', data);
  return data;
};

export const deleteFarm = async id => {
  return API.delete(`farms/farms/${id}/`, getAuthHeaders());
};

export const askChatGPTDB = async prompt => {
  return API.post(
    'assistant/chatgpt-db/',
    {prompt},
    getAuthHeaders(), // sends Authorization: Bearer <token>
  );
};

export const fetchVetRequests = async () => {
  return API.get('farms/vets/', getAuthHeaders());
};

// Bonus: Get the list of feeds (optional, if needed separately)
export const getFeeds = async () => {
  const response = await API.get('feed/feeds/', getAuthHeaders());
  return response.data;
};

// Feed animals in a category
export const feedAnimals = async data => {
  const response = await API.post('feed/feed-animals/', data, getAuthHeaders());
  return response.data;
};

export const getFeedingPlans = async () => {
  const response = await API.get('feed/feeding-plans/', getAuthHeaders());
  return response.data;
};

export const addFeedToStore = async data => {
  try {
    const response = await API.post('feed/feeds/', data, getAuthHeaders());
    console.log(response); // Log the full response to inspect its structure
    return response.data; // Ensure this contains the expected feed data
  } catch (error) {
    console.error('API Error:', error);
    throw error; // Optionally throw the error if you want to handle it further up the call chain
  }
};

export const createFeedingPlan = async data => {
  try {
    const response = await API.post(
      'feed/feeding-plans/',
      data,
      getAuthHeaders(),
    );
    console.log('Create Feeding Plan Response:', response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error(
      'Error creating feeding plan:',
      error.response?.data || error.message,
    );
    throw error; // Let caller handle the error
  }
};

/**
 * Fetch authenticated user's profile
 */
export const fetchUserProfile = async () => {
  try {
    const headers = await getAuthHeaders(); // returns { headers: { Authorization... } }

    const response = await API.get(
      'profiles/user/profile/', // must have trailing slash
      headers,
    );

    console.log('Fetched User Profile:', response.data);
    return response.data; // this should be the profile object
  } catch (error) {
    console.error(
      'Error fetching user profile:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateProfileImage = async imageUri => {
  try {
    const headers = await getAuthHeaders();

    const formData = new FormData();
    formData.append('profile_image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });

    const response = await API.patch(
      'profiles/user/profile/update/', // PATCH endpoint
      formData,
      {
        headers: {
          ...headers.headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    console.log('Profile image updated:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error updating profile image:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const updateCoverImage = async imageUri => {
  try {
    const headers = await getAuthHeaders();

    const formData = new FormData();
    formData.append('cover_image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'cover.jpg',
    });

    const response = await API.patch(
      'profiles/user/profile/update/',
      formData,
      {
        headers: {
          ...headers.headers,
          'Content-Type': 'multipart/form-data',
        },
      },
    );

    console.log('Cover image updated:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error updating cover image:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const deleteUserAccount = async () => {
  try {
    const headers = await getAuthHeaders(); // includes Authorization

    const response = await API.post(
      'accounts/delete-account/', // POST instead of DELETE
      {}, // empty body
      headers,
    );

    console.log('Delete account response:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error deleting account:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const requestVet = async (vetId, {message, signs, animalImage}) => {
  try {
    const token = await AsyncStorage.getItem('access_token');

    const formData = new FormData();
    formData.append('vet', vetId);
    if (message) formData.append('message', message);
    if (signs) formData.append('signs', signs);

    // Append image only if provided
    if (animalImage?.uri) {
      formData.append('animal_image', {
        uri: animalImage.uri,
        name: animalImage.fileName || 'animal.jpg',
        type: animalImage.type || 'image/jpeg',
      });
    }

    const response = await fetch(
      'http://192.168.100.4:8000/api/profiles/vet/request/',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      },
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('Server error response:', text);
      throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    console.log('Vet request response:', data);
    return data;
  } catch (error) {
    console.error('Error requesting vet:', error);
    throw error;
  }
};

// Fetch authenticated user's vet requests
export const fetchMyVetRequests = async () => {
  try {
    const headers = await getAuthHeaders(); // get auth headers

    const response = await API.get(
      'profiles/vet/requests/', // trailing slash
      headers, // pass headers as config
    );

    console.log('My vet requests:', response.data); // full response for debugging
    return response.data; // return the actual data array
  } catch (error) {
    console.error(
      'Error fetching my vet requests:',
      error.response?.data || error.message,
    );
    throw error; // re-throw for caller to handle
  }
};

export const fetchIncomingVetRequests = async () => {
  try {
    const config = await getAuthHeaders(); // your existing auth headers
    const response = await API.get('profiles/vet/requests/my', config); // pass it here
    console.log('Incoming vet requests:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching incoming vet requests:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const acceptVetRequest = async requestId => {
  try {
    const config = await getAuthHeaders();

    const response = await API.post(
      `vet/requests/${requestId}/accept/`,
      {}, // empty body
      config, // pass headers here
    );

    console.log('Accepted vet request:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error accepting vet request:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const declineVetRequest = async requestId => {
  try {
    const config = await getAuthHeaders();

    const response = await API.post(
      `vet/requests/${requestId}/decline/`,
      {},
      config,
    );

    console.log('Declined vet request:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error declining vet request:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
