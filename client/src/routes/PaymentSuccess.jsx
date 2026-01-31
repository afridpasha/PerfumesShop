import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import config from '../config';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { removeOrderedItems } = useContext(CartContext);
  const [status, setStatus] = useState('verifying');
  
  useEffect(() => {
    const verifyAndCreateOrder = async () => {
      const sessionId = searchParams.get('session_id');
      
      if (!sessionId) {
        navigate('/checkout');
        return;
      }

      const userInfo = localStorage.getItem('user');
      if (!userInfo) {
        navigate('/login');
        return;
      }

      const user = JSON.parse(userInfo);
      if (!user.token) {
        navigate('/login');
        return;
      }

      try {
        // Step 1: Verify payment with Stripe via backend
        const verifyResponse = await fetch(`${config.API_URL}/payment/verify-session`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify({ sessionId })
        });

        const paymentData = await verifyResponse.json();
        
        // Get checkout data early for both success and failure cases
        let checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || 'null');
        if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
          checkoutData = JSON.parse(localStorage.getItem('checkoutData') || 'null');
        }
        
        // Step 2: Check if payment is successful
        if (paymentData.status !== 'paid') {
          setStatus('failed');
          // Remove failed order items from cart
          if (checkoutData && checkoutData.items) {
            removeOrderedItems(checkoutData.items);
          }
          sessionStorage.removeItem('checkoutData');
          localStorage.removeItem('checkoutData');
          setTimeout(() => navigate('/checkout'), 2000);
          return;
        }

        // Step 3: Payment confirmed - Create order
        setStatus('creating_order');
        
        if (!checkoutData || !checkoutData.items || checkoutData.items.length === 0) {
          throw new Error('No order items found. Please try placing your order again.');
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

        const orderResponse = await fetch(`${config.API_URL}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}`,
          },
          body: JSON.stringify(orderData)
        });

        const orderResult = await orderResponse.json();

        if (!orderResponse.ok) {
          throw new Error(orderResult.message || 'Failed to create order');
        }

        // Step 4: Order created successfully - Clean up and redirect
        setStatus('success');
        
        // Clear cart immediately
        sessionStorage.removeItem('checkoutData');
        localStorage.removeItem('checkoutData');
        localStorage.removeItem('cart');
        localStorage.setItem('cart', JSON.stringify([]));
        
        setTimeout(() => navigate('/orders'), 1500);

      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        
        // Remove failed order items from cart on error
        const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || localStorage.getItem('checkoutData') || 'null');
        if (checkoutData && checkoutData.items) {
          removeOrderedItems(checkoutData.items);
        }
        sessionStorage.removeItem('checkoutData');
        localStorage.removeItem('checkoutData');
        
        setTimeout(() => navigate('/checkout'), 2000);
      }
    };

    verifyAndCreateOrder();
  }, [searchParams, removeOrderedItems, navigate]);

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
        background: status === 'success' ? '#4CAF50' : status === 'failed' || status === 'error' ? '#f44336' : '#2196F3',
        color: 'white', 
        padding: '2rem', 
        borderRadius: '10px',
        maxWidth: '500px'
      }}>
        {status === 'verifying' && (
          <>
            <h1>⏳ Verifying Payment...</h1>
            <p>Please wait while we confirm your payment with Stripe.</p>
          </>
        )}
        {status === 'creating_order' && (
          <>
            <h1>✅ Payment Confirmed!</h1>
            <p>Creating your order...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <h1>🎉 Order Created Successfully!</h1>
            <p>Redirecting to your orders...</p>
          </>
        )}
        {status === 'failed' && (
          <>
            <h1>❌ Payment Not Completed</h1>
            <p>Redirecting back to checkout...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1>⚠️ Error</h1>
            <p>Something went wrong. Redirecting to checkout...</p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
