import React, {createContext, useState, useEffect} from 'react';
import {fetchBillingSummary} from '../utils/api';

export const BillingContext = createContext();

export const BillingProvider = ({children}) => {
  const [billing, setBilling] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadBilling = async () => {
    try {
      const data = await fetchBillingSummary();
      setBilling(data);
    } catch (e) {
      console.log('Billing load failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBilling();
  }, []);

  return (
    <BillingContext.Provider
      value={{billing, loading, refreshBilling: loadBilling}}>
      {children}
    </BillingContext.Provider>
  );
};
