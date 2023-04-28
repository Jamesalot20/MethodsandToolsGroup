import React, { createContext, useEffect, useState } from 'react';
import api from '../api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [productDetails, setProductDetails] = useState({});

  const fetchProductDetails = async (productId) => {
    try {
      const response = await api.get(`/products/${productId}`);
      setProductDetails((prevDetails) => ({
        ...prevDetails,
        [productId]: response.data,
      }));
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };
// Add this useEffect block
useEffect(() => {
  cartItems.forEach((item) => {
    if (!productDetails[item.productId] && item.productId) {
      fetchProductDetails(item.productId);
    }
  });
}, [cartItems]);


  const addToCart = async (productId) => {
    try {
      // Retrieve the authentication token from local storage or another source
      const token = localStorage.getItem('authToken');

      const response = await api.post(
        '/carts/add',
        { productId, quantity: 1 },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      setCartItems(response.data.cart.items);
      fetchProductDetails(productId);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, productDetails }}>
      {children}
    </CartContext.Provider>
  );
};
