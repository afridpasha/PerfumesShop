import React, { useState, useContext, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import config from '../config';
import '../styles/Checkout.css';

// Import payment icons
import visaIcon from '../assets/payment-icons/visa.png';
import mastercardIcon from '../assets/payment-icons/mastercard.jpg';
import amexIcon from '../assets/payment-icons/amex.png';
import paypalIcon from '../assets/payment-icons/paypal.jpg';

const CheckoutForm = () => {
  const { cartItems, getCartTotal } = useContext(CartContext);
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
  });
  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
  });

  // Get customer info from localStorage on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    console.log('User data from localStorage:', user); // Debug log
    
    if (user) {
      setCustomerInfo({
        name: user.fullName || user.name || '',
        email: user.email || '',
      });
    }
  }, []);

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = (subtotal - promoDiscount) * 0.1;
  const total = subtotal + shipping + tax - promoDiscount;

  const getLocationFromCoordinates = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
      );
      const data = await response.json();
      
      if (data && data.address) {
        setShippingInfo({
          address: data.address.road || data.address.suburb || data.address.neighbourhood || '',
          city: data.address.city || data.address.town || data.address.village || '',
          postalCode: data.address.postcode || '',
          country: data.address.country || '',
        });
      }
    } catch (err) {
      console.error('Error getting address:', err);
      setError('Could not fetch address details');
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoadingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        getLocationFromCoordinates(latitude, longitude);
        setLoadingLocation(false);
      },
      (err) => {
        setLoadingLocation(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Location permission denied. Please enable location access.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Location information unavailable.');
            break;
          case err.TIMEOUT:
            setError('Location request timed out.');
            break;
          default:
            setError('An error occurred while getting location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setPromoLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${config.API_URL}/promo/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoCode,
          orderAmount: subtotal
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setPromoDiscount(data.discountAmount);
        setPromoApplied(true);
        setError(null);
      } else {
        setError(data.message);
        setPromoDiscount(0);
        setPromoApplied(false);
      }
    } catch (err) {
      setError('Failed to apply promo code');
      setPromoDiscount(0);
      setPromoApplied(false);
    } finally {
      setPromoLoading(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode('');
    setPromoDiscount(0);
    setPromoApplied(false);
    setError(null);
  };

  const handleCheckout = async (e) => {
    e.preventDefault();

    if (!customerInfo.name || !customerInfo.email) {
      setError('Please fill in all required fields.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      // Store checkout data for PaymentSuccess page
      const checkoutData = {
        items: cartItems,
        customerInfo,
        shippingInfo,
        totals: { subtotal, shipping, tax, total }
      };
      sessionStorage.setItem('checkoutData', JSON.stringify(checkoutData));

      const response = await fetch(`${config.API_URL}/payment/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image
          })),
          customerInfo
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (err) {
      setError(err.message);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleCheckout} className="checkout-form">
      <div className="checkout-section">
        <h2>Customer Information</h2>
        <div className="customer-info-display">
          <p><strong>Name:</strong> {customerInfo.name}</p>
          <p><strong>Email:</strong> {customerInfo.email}</p>
        </div>
      </div>

      <div className="checkout-section">
        <div className="section-header">
          <h2>Shipping Information</h2>
          <button 
            type="button" 
            onClick={handleGetLocation} 
            className="location-btn"
            disabled={loadingLocation}
          >
            {loadingLocation ? (
              <>
                <span className="spinner"></span>
                <span className="location-btn-text">Detecting Location...</span>
              </>
            ) : (
              <>
                <span className="location-icon">📍</span>
                <span className="location-btn-text">Use My Location</span>
              </>
            )}
          </button>
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Address *"
            value={shippingInfo.address}
            onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
            required
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="City *"
            value={shippingInfo.city}
            onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Postal Code *"
            value={shippingInfo.postalCode}
            onChange={(e) => setShippingInfo({ ...shippingInfo, postalCode: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Country *"
            value={shippingInfo.country}
            onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="checkout-section">
        <h2>Promo Code</h2>
        <div className="promo-section">
          <div className="promo-input-group">
            <input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              disabled={promoApplied}
            />
            {!promoApplied ? (
              <button 
                type="button" 
                onClick={handleApplyPromo}
                disabled={promoLoading || !promoCode.trim()}
                className="apply-promo-btn"
              >
                {promoLoading ? 'Applying...' : 'Apply'}
              </button>
            ) : (
              <button 
                type="button" 
                onClick={handleRemovePromo}
                className="remove-promo-btn"
              >
                Remove
              </button>
            )}
          </div>
          {promoApplied && (
            <div className="promo-success">
              ✅ Promo code "{promoCode}" applied! You saved ${promoDiscount.toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <div className="checkout-section">
        <h2>Payment Methods</h2>
        <div className="payment-methods">
          <img src={visaIcon} alt="Visa" className="payment-icon" onError={(e) => e.target.style.display = 'none'} />
          <img src={mastercardIcon} alt="Mastercard" className="payment-icon" onError={(e) => e.target.style.display = 'none'} />
          <img src={amexIcon} alt="American Express" className="payment-icon" onError={(e) => e.target.style.display = 'none'} />
          <img src={paypalIcon} alt="PayPal" className="payment-icon" onError={(e) => e.target.style.display = 'none'} />
        </div>
        <p className="payment-secure">🔒 Your payment information is secure and encrypted</p>
      </div>

      <div className="order-summary-checkout">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        {promoApplied && (
          <div className="summary-row promo-discount">
            <span>Promo Discount ({promoCode}):</span>
            <span>-{formatPrice(promoDiscount)}</span>
          </div>
        )}
        <div className="summary-row">
          <span>Shipping:</span>
          <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <span>{formatPrice(tax)}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      <button type="submit" disabled={processing} className="pay-button">
        {processing ? 'Redirecting to Payment...' : `Proceed to Payment - ${formatPrice(total)}`}
      </button>
    </form>
  );
};

const Checkout = () => {
  const { cartItems } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <button onClick={() => window.location.href = '/products'} className="shop-button">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <CheckoutForm />
    </div>
  );
};

export default Checkout;