import React, {createContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const CartContext = createContext();

export const CartProvider = ({children}) => {
  const [cartItems, setCartItems] = useState([]);

  // Load cart from storage
  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const savedCart = await AsyncStorage.getItem('cart');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.log('Load cart error:', error);
    }
  };

  // Save cart to storage
  const saveCart = async updatedCart => {
    try {
      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      console.log('Save cart error:', error);
    }
  };

  // Add item to cart
  const addToCart = item => {
    const updatedCart = [...cartItems];

    // Find if item already exists
    const existingIndex = updatedCart.findIndex(i => i.id === item.id);

    if (existingIndex !== -1) {
      updatedCart[existingIndex].quantity += item.quantity || 1;
    } else {
      updatedCart.push({
        ...item,
        quantity: item.quantity || 1,
      });
    }

    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const removeFromCart = id => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const increaseQty = id => {
    const updatedCart = cartItems.map(item =>
      item.id === id ? {...item, quantity: item.quantity + 1} : item,
    );
    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const decreaseQty = id => {
    const updatedCart = cartItems
      .map(item =>
        item.id === id && item.quantity > 1
          ? {...item, quantity: item.quantity - 1}
          : item,
      )
      .filter(item => item.quantity > 0);

    setCartItems(updatedCart);
    saveCart(updatedCart);
  };

  const getCartTotal = () => {
    return cartItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const clearCart = () => {
    setCartItems([]);
    saveCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        getCartTotal,
        clearCart,
      }}>
      {children}
    </CartContext.Provider>
  );
};
