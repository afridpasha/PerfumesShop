import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import config from '../config';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useContext(CartContext);
  const [status, setStatus] = useState('verifying');
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (!sessionId) {
      navigate('/checkout');
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

    // Verify payment with backend
    fetch(`${config.API_URL}/payment/verify-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`,
      },
      body: JSON.stringify({ sessionId })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'complete' || data.status === 'paid') {
        setStatus('success');
        
        // Create order
        const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');
        
        if (checkoutData.items && checkoutData.items.length > 0) {
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

          return fetch(`${config.API_URL}/orders`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`,
            },
            body: JSON.stringify(orderData)
          });
        }
      } else {
        setStatus('failed');
        setTimeout(() => navigate('/checkout'), 2000);
      }
    })
    .then(response => {
      if (response) return response.json();
    })
    .then(data => {
      if (data) {
        clearCart();
        sessionStorage.removeItem('checkoutData');
        navigate('/orders');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      setStatus('error');
      setTimeout(() => navigate('/checkout'), 2000);
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
        background: status === 'success' ? '#4CAF50' : status === 'failed' ? '#f44336' : '#2196F3',
        color: 'white', 
        padding: '2rem', 
        borderRadius: '10px',
        maxWidth: '500px'
      }}>
        {status === 'verifying' && (
          <>
            <h1>⏳ Verifying Payment...</h1>
            <p>Please wait while we confirm your payment.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h1>🎉 Payment Successful!</h1>
            <p>Redirecting to your orders...</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <h1>❌ Payment Failed</h1>
            <p>Redirecting back to checkout...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1>⚠️ Error</h1>
            <p>Something went wrong. Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
