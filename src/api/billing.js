// File: src/api/billing.js

import axios from 'axios';

export const fetchInvoices = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/billing/invoices/');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Rethrow or handle error as needed
  }
};
