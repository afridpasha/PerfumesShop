import React, { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { clearCart } = useContext(CartContext);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      clearCart();
      sessionStorage.removeItem('checkoutData');
    }
    
    navigate('/orders', { replace: true });
  }, [searchParams, clearCart, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '60vh',
      textAlign: 'center'
    }}>
      <div style={{ 
        background: '#4CAF50', 
        color: 'white', 
        padding: '2rem', 
        borderRadius: '10px'
      }}>
        <h1>🎉 Payment Successful!</h1>
        <p>Redirecting...</p>
      </div>
    </div>
  );
};

export default PaymentSuccess;
