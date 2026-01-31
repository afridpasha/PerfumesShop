import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import config from '../config';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useContext(CartContext);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    console.log('Payment Success - Session ID:', sessionId);
    
    if (!sessionId) {
      console.log('No session ID, redirecting to home');
      navigate('/');
      return;
    }

    // Check if user is logged in
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      console.log('No user info, redirecting to login');
      navigate('/login');
      return;
    }

    const user = JSON.parse(userInfo);
    if (!user.token) {
      console.log('No user token, redirecting to login');
      navigate('/login');
      return;
    }

    // Check if already processed
    const processedSessions = JSON.parse(localStorage.getItem('processedSessions') || '[]');
    if (processedSessions.includes(sessionId)) {
      console.log('Session already processed, redirecting to orders');
      navigate('/orders');
      return;
    }
    
    // Mark as processed immediately
    processedSessions.push(sessionId);
    localStorage.setItem('processedSessions', JSON.stringify(processedSessions));

    // Get checkout data
    const checkoutDataStr = sessionStorage.getItem('checkoutData');
    console.log('Checkout data:', checkoutDataStr);
    
    if (!checkoutDataStr) {
      console.log('No checkout data, redirecting to orders');
      clearCart();
      setTimeout(() => navigate('/orders'), 1500);
      return;
    }

    const checkoutData = JSON.parse(checkoutDataStr);
    
    if (!checkoutData.items || checkoutData.items.length === 0) {
      console.log('No items, redirecting to orders');
      clearCart();
      setTimeout(() => navigate('/orders'), 1500);
      return;
    }

    // Create order
    const orderData = {
      orderItems: checkoutData.items.map(item => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        size: item.size || '50ml',
        product: item._id
      })),
      shippingAddress: checkoutData.shippingInfo || {
        address: 'Address not provided',
        city: 'City not provided',
        postalCode: '00000',
        country: 'Country not provided'
      },
      paymentMethod: 'Card',
      itemsPrice: checkoutData.totals?.subtotal || 0,
      taxPrice: checkoutData.totals?.tax || 0,
      shippingPrice: checkoutData.totals?.shipping || 0,
      totalPrice: checkoutData.totals?.total || 0,
      isPaid: true,
      paidAt: new Date().toISOString(),
      stripeSessionId: sessionId
    };

    console.log('Creating order:', orderData);

    fetch(`${config.API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify(orderData)
    })
    .then(response => {
      console.log('Response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Order created:', data);
      clearCart();
      sessionStorage.removeItem('checkoutData');
      setTimeout(() => navigate('/orders'), 1500);
    })
    .catch(error => {
      console.error('Error creating order:', error);
      clearCart();
      sessionStorage.removeItem('checkoutData');
      setTimeout(() => navigate('/orders'), 1500);
    });
  }, [searchParams, clearCart, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div style={{ 
        background: '#4CAF50', 
        color: 'white', 
        padding: '2rem', 
        borderRadius: '10px',
        maxWidth: '500px'
      }}>
        <h1>🎉 Payment Successful!</h1>
        <p>Thank you for your purchase. Your order has been confirmed.</p>
        <p>Redirecting to your orders...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
