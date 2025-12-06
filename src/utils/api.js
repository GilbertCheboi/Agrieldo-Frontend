// File: src/utils/api.js

import API from './axiosInstance'; // Configured Axios instance for React Native
import AsyncStorage from '@react-native-async-storage/async-storage';

const FARMS_URL = 'http://api.agrieldo.com/api/farms/farms/';
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
// 1. Get Feed Categories

export const createListing = async ({animal, price, description, imageUri}) => {
  const formData = new FormData();
  formData.append('animal', animal);
  formData.append('price', price);
  formData.append('description', description);

  if (imageUri) {
    formData.append('image', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'listing.jpg',
    });
  }

  const response = await API.post('market/listings/', formData, {
    headers: {'Content-Type': 'multipart/form-data'},
  });

  return response.data;
};

export const getMarketListingDetails = async id => {
  const response = await API.get(`market/listings/${id}/`);
  return response.data;
};

export const toggleListingStatus = async (id, status) => {
  const response = await API.patch(`market/listings/${id}/toggle/`, {
    status,
  });
  return response.data;
};

export const getMarketListings = async () => {
  const response = await API.get('market/listings/all');
  return response.data;
};

export const getDrugCategories = async () => {
  const response = await API.get('drug_store/categories/');
  return response.data;
};

export const getDrugsByCategory = async categoryId => {
  const response = await API.get(`drug_store/categories/${categoryId}/drugs/`);
  return response.data;
};

export const getDrugDetails = async id => {
  const response = await API.get(`drug_store/drugs/${id}/`);
  return response.data;
};

export const createDrugOrder = async orderData => {
  const response = await API.post('drug_store/orders/', orderData);
  return response.data;
};

export const getFeedCategories = async () => {
  const response = await API.get('feed_store/categories/', getAuthHeaders());
  return response.data;
};

export const initiateMpesaPayment = async ({phone, amount, order_id}) => {
  const response = await API.post('feed_store/stk_push/', {
    phone,
    amount,
    order_id,
  });

  return response.data;
};

export const createFeedOrder = async data => {
  const response = await API.post('feed_store/orders/', data, getAuthHeaders());
  return response.data;
};
export const createUnifiedCheckout = async (
  cartItems,
  customerName,
  phone,
  totalAmount,
) => {
  const payload = {
    cart: cartItems,
    customer_name: customerName,
    customer_contact: phone,
    total_amount: totalAmount,
  };

  const res = await API.post('orders/checkout/unified/', payload);
  return res.data; // contains unified_order_id, feed_orders, drug_orders, total_amount
};

// Mpesa STK using feed_store endpoint
export const unifiedMpesaPayment = async ({phone, amount, unified_order}) => {
  const payload = {
    phone,
    amount,
    unified_order,
  };

  const res = await API.post('orders/mpesa/checkout/', payload);
  return res.data;
};

// 2. Get Products for a Category
export const getFeedProducts = async categoryId => {
  const response = await API.get(
    `feed_store/categories/${categoryId}/products/`,
    getAuthHeaders(),
  );
  return response.data;
};

// 3. Get Single Product Details
export const getFeedProductDetail = async productId => {
  const response = await API.get(
    `feed_store/products/${productId}/`,
    getAuthHeaders(),
  );
  return response.data;
};

// 4. Create an Order

export const getFarms = async () => {
  const response = await API.get('farms/get_farms/', getAuthHeaders()); // replace 'farms/' with your endpoint for owner farms
  return response.data;
};

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
    let url = `/farms/${farmId}/animals/`;
    let allAnimals = [];

    while (url) {
      const response = await API.get(url, getAuthHeaders());
      const data = response.data;

      // CASE 1: API returns a plain array (non-paginated)
      if (Array.isArray(data)) {
        allAnimals = data;
        break; // no pagination
      }

      // CASE 2: API returns paginated DRF response
      if (data.results) {
        allAnimals = [...allAnimals, ...data.results];

        url = data.next ? data.next.replace(API.defaults.baseURL, '') : null;
      } else {
        // Unexpected format — break cleanly
        break;
      }
    }

    console.log(`Fetched Animals for farm ${farmId}:`, allAnimals.length);
    return allAnimals;
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
export const updateLactationRecord = async (recordId, data) => {
  return API.put(`animals/lactation/${recordId}/edit`, data, getAuthHeaders());
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

// Feed animals in a category
export const feedAnimals = async data => {
  const response = await API.post('feed/feed-animals/', data, getAuthHeaders());
  return response.data;
};
// utils/api.js

// utils/api.js

// ✅ Get feeds for a specific store
export const getFeeds = async storeId => {
  try {
    const url = storeId ? `feed/feeds/?store=${storeId}` : 'feed/feeds/';
    const response = await API.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching feeds:', error.response?.data || error);
    throw error;
  }
};

// ✅ Add feed to a specific store
export const addFeedToStore = async feedData => {
  try {
    // feedData should include { name, quantity_kg, price_per_kg, store }
    const response = await API.post('feed/feeds/', feedData, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('API Error adding feed:', error.response?.data || error);
    throw error;
  }
};

// ✅ Get feeding plans (optional but recommended fix)
export const getFeedingPlans = async storeId => {
  try {
    const url = storeId
      ? `feed/feeding-plans/?store=${storeId}`
      : 'feed/feeding-plans/';
    const response = await API.get(url, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching feeding plans:',
      error.response?.data || error,
    );
    throw error;
  }
};
export const getStaffFarms = async () => {
  const headers = await getAuthHeaders();
  const res = await API.get('farms/staff/farms/', headers);
  return res.data;
};

export const createFeedingPlan = async data => {
  try {
    console.log('➡️ Creating Feeding Plan with data:', data);

    const response = await API.post(
      'feed/feeding-plans/',
      data,
      typeof getAuthHeaders === 'function'
        ? getAuthHeaders() // if getAuthHeaders already returns { headers: {...} }
        : {headers: getAuthHeaders}, // fallback pattern if it's just a header object
    );

    console.log('✅ Feeding Plan Created:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error creating feeding plan:',
      error.response?.data || error.message,
    );
    throw error;
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
      'http://api.agrieldo.com/api/profiles/vet/request/',
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

/**
 * -------------------------------
 * 🧠 AI Chat API (ChatGPT Integration)
 * -------------------------------
 */

const CHAT_BASE_URL = 'http://api.agrieldo.com/api/AI_Chat'; // Update to your actual domain/base

/**
 * List all chat sessions for the authenticated user.
 */
export const listChats = async () => {
  try {
    const headers = await getAuthHeaders();
    const response = await API.get(`${CHAT_BASE_URL}/chats/`, headers);
    console.log('Fetched chat sessions:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching chats:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Create a new chat session (auto-title generated on backend).
 * You can optionally pass a "topic" to help the title generation.
 */
export const createChat = async (topic = '') => {
  try {
    const headers = await getAuthHeaders();
    const response = await API.post(
      `${CHAT_BASE_URL}/chats/`,
      topic ? {topic} : {},
      headers,
    );
    console.log('Created new chat:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error creating chat:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Fetch message history for a given chat ID.
 */
export const getChatMessages = async chatId => {
  try {
    const headers = await getAuthHeaders();
    const response = await API.get(
      `${CHAT_BASE_URL}/chats/${chatId}/messages/`,
      headers,
    );
    console.log(`Fetched messages for chat ${chatId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error fetching messages for chat ${chatId}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Send a message to a chat and get AI response.
 */
export const sendChatMessage = async (chatId, message) => {
  try {
    const headers = await getAuthHeaders();
    const response = await API.post(
      `${CHAT_BASE_URL}/chats/${chatId}/messages/`,
      {message},
      headers,
    );
    console.log('AI Chat reply:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      'Error sending chat message:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Delete a chat session by ID.
 */
export const deleteChat = async chatId => {
  try {
    const headers = await getAuthHeaders();
    const response = await API.delete(
      `${CHAT_BASE_URL}/chats/${chatId}/`,
      headers,
    );
    console.log(`Deleted chat ${chatId}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Error deleting chat ${chatId}:`,
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Fetch lactating animals for milk production input
 */
export const fetchLactatingAnimals = async () => {
  try {
    const headers = await getAuthHeaders();

    const response = await API.get(
      `animals/production/milk/lactating-animals/`,
      headers,
    );

    console.log('✅ Fetched Lactating Animals:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error fetching lactating animals:',
      error.response ? error.response.data : error.message,
    );
    return [];
  }
};

/**
 * Add milk production records for multiple animals
 */
export const addMilkProductionRecords = async records => {
  try {
    console.log('🚀 Sending payload:', JSON.stringify(records, null, 2));

    const headers = await getAuthHeaders(); // Ensure token is awaited

    const response = await API.post(
      `animals/production/milk/`,
      records,
      headers, // Axios expects headers as a separate object
    );

    console.log(
      '✅ Milk production records added successfully:',
      response.data,
    );
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error adding milk production records:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

/**
 * Fetch summarized daily milk production data
 */
export const fetchDailyMilkProductionSummary = async () => {
  try {
    const headers = await getAuthHeaders(); // Await header setup (important)

    const response = await API.get(
      `animals/production/daily-summary/`,
      headers, // Pass config object correctly
    );

    console.log('✅ Fetched daily milk production summary:', response.data);
    return response.data;
  } catch (error) {
    console.error(
      '❌ Error fetching daily milk production summary:',
      error.response?.data || error.message,
    );
    return [];
  }
};
export const getFeedActivity = async feedId => {
  const response = await API.get(
    `feed/feed-activity/${feedId}/`,
    getAuthHeaders(),
  );
  return response.data;
};

export const getFarmStaff = async farmId => {
  try {
    const response = await API.get(`/farms/${farmId}/staff/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await API.get(`accounts/list_users/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async userId => {
  try {
    const response = await API.get(
      `accounts/list_users/${userId}/`,
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw error;
  }
};

export const addFarmStaff = async (farmId, userId) => {
  try {
    const response = await API.post(
      `/farms/${farmId}/add-staff/`,
      {user_id: userId},
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error('Error adding staff:', error);
    throw error;
  }
};

export const removeFarmStaff = async (farmId, userId) => {
  try {
    await API.delete(
      `/farms/${farmId}/remove-staff/${userId}/`,
      getAuthHeaders(),
    );
    return {message: 'Staff member removed successfully.'};
  } catch (error) {
    console.error('Error removing staff:', error);
    throw error;
  }
};

// Get all vets assigned to a specific farm
export const getFarmVets = async farmId => {
  try {
    const response = await API.get(`/farms/${farmId}/vets/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching vets:', error);
    throw error;
  }
};

// Get list of all users eligible to be assigned as vets
export const getVets = async () => {
  try {
    const response = await API.get(`/accounts/list_vets/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error('Error fetching vet users:', error);
    throw error;
  }
};

// Assign vet to a farm
export const addFarmVet = async (farmId, userId) => {
  try {
    const response = await API.post(
      `/farms/${farmId}/add-vet/`,
      {user_id: userId},
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error('Error assigning vet:', error);
    throw error;
  }
};

// Remove vet from a farm
export const removeFarmVet = async (farmId, userId) => {
  try {
    await API.delete(
      `/farms/${farmId}/remove-vet/${userId}/`,
      getAuthHeaders(),
    );
    return {message: 'Vet removed successfully.'};
  } catch (error) {
    console.error('Error removing vet:', error);
    throw error;
  }
};

export const fetchBillingSummary = async () => {
  try {
    const response = await API.get('/billing/summary/', getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error(
      'Error fetching billing summary:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const startBillingPayment = async () => {
  try {
    const response = await API.post('/billing/pay/', {}, getAuthHeaders());
    return response.data; // contains payment_id + amount
  } catch (error) {
    console.error(
      'Error starting billing payment:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const triggerMpesaStkPush = async (phone, amount, paymentId) => {
  try {
    const response = await API.post(
      '/orders/mpesa/stkpush/',
      {
        phone,
        amount,
        payment_id: paymentId,
      },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error triggering MPESA STK Push:',
      error.response?.data || error.message,
    );
    throw error;
  }
};
export const triggerUnifiedOrderStkPush = async (
  phone,
  amount,
  unifiedOrderId,
) => {
  try {
    const response = await API.post(
      '/orders/mpesa/stkpush/',
      {
        phone,
        amount,
        unified_order: unifiedOrderId,
      },
      getAuthHeaders(),
    );
    return response.data;
  } catch (error) {
    console.error(
      'Error triggering unified order MPESA:',
      error.response?.data || error.message,
    );
    throw error;
  }
};

export const getCooperativeDetails = async coopId => {
  const headers = await getAuthHeaders();
  const response = await API.get(`cooperatives/details/${coopId}/`, headers);
  return response.data;
};

export const getCooperativeFarmers = async coopId => {
  const headers = await getAuthHeaders();
  const response = await API.get(`cooperatives/farmers/${coopId}/`, headers);
  return response.data;
};

export const getMilkRecords = async (coopId, date) => {
  const headers = await getAuthHeaders();
  const response = await API.get(
    `cooperatives/milk/records/${coopId}/?date=${date}`,
    headers,
  );
  return response.data;
};

export const createMilkRecord = async payload => {
  const headers = await getAuthHeaders();
  const response = await API.post(
    `cooperatives/milk/create/`,
    payload,
    headers,
  );
  return response.data;
};

export const updateMilkRecord = async (recordId, payload) => {
  const headers = await getAuthHeaders();
  const response = await API.patch(
    `cooperatives/milk/update/${recordId}/`,
    payload,
    headers,
  );
  return response.data;
};

export const deleteMilkRecord = async recordId => {
  const headers = await getAuthHeaders();
  const response = await API.delete(
    `cooperatives/milk/delete/${recordId}/`,
    headers,
  );
  return response.data;
};
