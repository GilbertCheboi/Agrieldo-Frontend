// src/utils/axiosInstance.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: 'http://95.179.245.72:8000/api/',
  timeout: 10000,
});

API.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // No Content-Type here, leave it dynamic
    return config;
  },
  error => Promise.reject(error),
);

export default API;
