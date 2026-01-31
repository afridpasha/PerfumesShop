import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load cart items from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) {
        throw new Error('Please login to add items to cart');
      }

      // Check if product already exists in cart
      const existingItem = cartItems.find(item => item._id === product._id);

      if (existingItem) {
        // Update quantity if product exists
        setCartItems(cartItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        ));
      } else {
        // Add new product to cart
        setCartItems([...cartItems, { ...product, quantity }]);
      }

      // Here you would typically make an API call to sync with backend
      // await axios.post('/api/cart', { productId: product._id, quantity });

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId) => {
    try {
      setLoading(true);
      setError(null);

      setCartItems(cartItems.filter(item => item._id !== productId));

      // Here you would typically make an API call to sync with backend
      // await axios.delete(`/api/cart/${productId}`);

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      setLoading(true);
      setError(null);

      if (quantity < 1) {
        await removeFromCart(productId);
        return;
      }

      setCartItems(cartItems.map(item =>
        item._id === productId
          ? { ...item, quantity }
          : item
      ));

      // Here you would typically make an API call to sync with backend
      // await axios.put(`/api/cart/${productId}`, { quantity });

    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      error,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}; 