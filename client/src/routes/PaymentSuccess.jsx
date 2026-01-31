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
      navigate('/orders');
      return;
    }

    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const user = JSON.parse(userInfo);
    if (!user.token) {
      navigate('/login');
      return;
    }

    const processedSessions = JSON.parse(localStorage.getItem('processedSessions') || '[]');
    if (processedSessions.includes(sessionId)) {
      navigate('/orders');
      return;
    }
    
    processedSessions.push(sessionId);
    localStorage.setItem('processedSessions', JSON.stringify(processedSessions));

    const checkoutDataStr = sessionStorage.getItem('checkoutData');
    
    if (!checkoutDataStr) {
      clearCart();
      navigate('/orders');
      return;
    }

    const checkoutData = JSON.parse(checkoutDataStr);
    
    if (!checkoutData.items || checkoutData.items.length === 0) {
      clearCart();
      navigate('/orders');
      return;
    }

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

    fetch(`${config.API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify(orderData)
    })
    .then(response => response.json())
    .then(data => {
      console.log('Order created:', data);
      clearCart();
      sessionStorage.removeItem('checkoutData');
      navigate('/orders');
    })
    .catch(error => {
      console.error('Error:', error);
      clearCart();
      sessionStorage.removeItem('checkoutData');
      navigate('/orders');
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
        <p>Redirecting to your orders...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
