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
    
    if (sessionId) {
      // Check if this session was already processed
      const processedSessions = JSON.parse(localStorage.getItem('processedSessions') || '[]');
      if (processedSessions.includes(sessionId)) {
        navigate('/orders');
        return;
      }
      
      // Get checkout data from sessionStorage
      const checkoutData = JSON.parse(sessionStorage.getItem('checkoutData') || '{}');
      
      if (checkoutData.items && checkoutData.items.length > 0) {
        const user = JSON.parse(localStorage.getItem('userInfo') || '{}');
        
        if (!user.token) {
          console.error('No user token found');
          navigate('/login');
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
          itemsPrice: checkoutData.totals.subtotal,
          taxPrice: checkoutData.totals.tax,
          shippingPrice: checkoutData.totals.shipping,
          totalPrice: checkoutData.totals.total,
          stripeSessionId: sessionId
        };

        // Mark session as processed
        processedSessions.push(sessionId);
        localStorage.setItem('processedSessions', JSON.stringify(processedSessions));

        // Save to MongoDB
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
          setTimeout(() => {
            navigate('/orders');
          }, 2000);
        })
        .catch(error => {
          console.error('Error creating order:', error);
          navigate('/orders');
        });
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
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