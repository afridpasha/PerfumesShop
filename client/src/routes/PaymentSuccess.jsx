import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import config from '../config';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your payment...');
  
  useEffect(() => {
    const verifyPayment = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        console.log('No session ID found');
        navigate('/checkout', { replace: true });
        return;
      }

      // Restore userInfo from sessionStorage if not in localStorage
      let userInfo = localStorage.getItem('userInfo');
      if (!userInfo) {
        userInfo = sessionStorage.getItem('userInfo');
        if (userInfo) {
          localStorage.setItem('userInfo', userInfo);
          console.log('Restored userInfo from sessionStorage');
        }
      }
      
      console.log('Checking userInfo:', userInfo ? 'exists' : 'not found');
      
      if (!userInfo) {
        console.log('No user info, redirecting to login');
        navigate('/login', { replace: true });
        return;
      }

      let user;
      try {
        user = JSON.parse(userInfo);
        console.log('User parsed successfully, has token:', !!user.token);
      } catch (e) {
        console.log('Failed to parse user info');
        navigate('/login', { replace: true });
        return;
      }

      if (!user || !user.token) {
        console.log('No user token found');
        navigate('/login', { replace: true });
        return;
      }

      try {
        console.log('Verifying payment with session ID:', sessionId);
        
        const verifyResponse = await fetch(`${config.API_URL}/payment/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ sessionId })
        });

        if (!verifyResponse.ok) {
          throw new Error('Failed to verify payment');
        }

        const paymentData = await verifyResponse.json();
        console.log('Payment verification result:', paymentData);
        
        if (paymentData.status !== 'paid') {
          console.log('Payment not completed, status:', paymentData.status);
          setStatus('failed');
          setMessage('Payment was not completed. Redirecting to checkout...');
          setTimeout(() => navigate('/checkout', { replace: true }), 2000);
          return;
        }

        console.log('Payment successful! Creating order...');
        setStatus('creating');
        setMessage('Payment confirmed! Creating your order...');
        
        const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || 'null');
        
        if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
          console.log('No checkout data found, but payment was successful');
          localStorage.removeItem('cart');
          localStorage.setItem('cart', JSON.stringify([]));
          sessionStorage.removeItem('checkoutData');
          
          setStatus('success');
          setMessage('Payment successful! Redirecting to orders...');
          navigate('/orders', { replace: true });
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

        console.log('Creating order with data:', orderData);

        const orderResponse = await fetch(`${config.API_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(orderData)
        });

        if (!orderResponse.ok) {
          const errorData = await orderResponse.json();
          throw new Error(errorData.message || 'Failed to create order');
        }

        const orderResult = await orderResponse.json();
        console.log('Order created successfully:', orderResult);

        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify([]));
        sessionStorage.removeItem('checkoutData');
        
        setStatus('success');
        setMessage('Order created successfully! Redirecting...');
        
        navigate('/orders', { replace: true });

      } catch (error) {
        console.error('Error during payment verification:', error);
        setStatus('error');
        setMessage('An error occurred. Redirecting to checkout...');
        setTimeout(() => navigate('/checkout', { replace: true }), 2000);
      }
    };

    verifyPayment();
  }, [searchParams, navigate]);

  const getBackgroundColor = () => {
    switch (status) {
      case 'success': return '#4CAF50';
      case 'failed': return '#f44336';
      case 'error': return '#ff9800';
      default: return '#2196F3';
    }
  };

  const getIcon = () => {
    switch (status) {
      case 'verifying': return '⏳';
      case 'creating': return '✅';
      case 'success': return '🎉';
      case 'failed': return '❌';
      case 'error': return '⚠️';
      default: return '⏳';
    }
  };

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
        background: getBackgroundColor(),
        color: 'white', 
        padding: '2rem', 
        borderRadius: '10px',
        maxWidth: '500px',
        minWidth: '300px'
      }}>
        <h1 style={{ fontSize: '3rem', margin: '0 0 1rem 0' }}>{getIcon()}</h1>
        <h2 style={{ margin: '0 0 1rem 0' }}>
          {status === 'verifying' && 'Verifying Payment'}
          {status === 'creating' && 'Creating Order'}
          {status === 'success' && 'Success!'}
          {status === 'failed' && 'Payment Failed'}
          {status === 'error' && 'Error'}
        </h2>
        <p style={{ margin: 0 }}>{message}</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
