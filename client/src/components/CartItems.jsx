import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import config from '../config';
import '../styles/CartItems.css';
import { FaTrash, FaHeart, FaMinus, FaPlus } from 'react-icons/fa';

// Import payment icons
import visaIcon from '../assets/payment-icons/visa.png';
import mastercardIcon from '../assets/payment-icons/mastercard.jpg';
import amexIcon from '../assets/payment-icons/amex.png';
import paypalIcon from '../assets/payment-icons/paypal.jpg';

const CartItems = () => {
  const navigate = useNavigate();
  const { 
    cartItems, 
    loading, 
    error, 
    removeFromCart, 
    updateQuantity,
    getCartTotal 
  } = useContext(CartContext);
  
  const [savedItems, setSavedItems] = useState([]);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoLoading, setPromoLoading] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');

  const shippingRates = {
    standard: 5.99,
    express: 14.99,
    overnight: 24.99
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleSaveForLater = (item) => {
    removeFromCart(item._id);
    setSavedItems([...savedItems, item]);
  };

  const handleMoveToCart = (item) => {
    setSavedItems(savedItems.filter(saved => saved._id !== item._id));
    updateQuantity(item._id, 1);
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setPromoLoading(true);
    
    try {
      console.log('Applying promo:', promoCode, 'Subtotal:', calculateSubtotal());
      
      const response = await fetch(`${config.API_URL}/promo/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: promoCode,
          orderAmount: calculateSubtotal()
        })
      });
      
      const data = await response.json();
      console.log('Promo response:', data);
      
      if (response.ok) {
        setPromoDiscount(data.discountAmount);
        setPromoApplied(true);
        console.log('Promo applied successfully:', data);
      } else {
        console.error('Promo validation failed:', data);
        alert(data.message);
        setPromoDiscount(0);
        setPromoApplied(false);
      }
    } catch (err) {
      console.error('Promo error:', err);
      alert('Failed to apply promo code');
      setPromoDiscount(0);
      setPromoApplied(false);
    } finally {
      setPromoLoading(false);
    }
  };

  const calculateSubtotal = () => getCartTotal();

  const calculateShipping = () => {
    const subtotal = calculateSubtotal();
    if (subtotal > 100) return 0; // Free shipping over $100
    return shippingRates[shippingMethod];
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1; // 10% tax rate
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateShipping() + calculateTax() - promoDiscount;
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) return <div className="cart-loading">Loading cart...</div>;
  if (error) return <div className="cart-error">{error}</div>;
  if (!cartItems.length) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some perfumes to your cart and they will appear here</p>
        <Link to="/products" className="continue-shopping">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-items-container">
        <h2>Shopping Cart ({cartItems.length} items)</h2>
        
        <div className="cart-items">
          {cartItems.map(item => (
            <div key={item._id} className="cart-item">
              <div className="item-image">
                <img src={item.image} alt={item.name} />
              </div>
              
              <div className="item-details">
                <h3>{item.name}</h3>
                <p className="item-description">{item.description}</p>
                <p className="item-price">{formatPrice(item.price)}</p>
                
                <div className="item-actions">
                  <div className="quantity-controls">
                    <button 
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="quantity-btn"
                    >
                      <FaMinus />
                    </button>
                    <span className="quantity">{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="quantity-btn"
                    >
                      <FaPlus />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => handleSaveForLater(item)}
                    className="save-for-later-btn"
                  >
                    <FaHeart />
                    Save for Later
                  </button>
                  
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="remove-btn"
                  >
                    <FaTrash />
                    Remove
                  </button>
                </div>
              </div>
              
              <div className="item-total">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        {savedItems.length > 0 && (
          <div className="saved-items">
            <h3>Saved for Later ({savedItems.length} items)</h3>
            {savedItems.map(item => (
              <div key={item._id} className="saved-item">
                <img src={item.image} alt={item.name} />
                <div className="saved-item-details">
                  <h4>{item.name}</h4>
                  <p>{formatPrice(item.price)}</p>
                  <button onClick={() => handleMoveToCart(item)}>
                    Move to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cart-summary">
        <h3>Order Summary</h3>
        
        <div className="promo-code">
          <input
            type="text"
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            disabled={promoApplied}
          />
          <button onClick={handleApplyPromo} disabled={promoLoading || !promoCode.trim() || promoApplied}>
            {promoLoading ? 'Applying...' : promoApplied ? 'Applied' : 'Apply'}
          </button>
          {promoApplied && (
            <div className="promo-success">
              ✅ Saved ${promoDiscount.toFixed(2)}
            </div>
          )}
        </div>

        <div className="shipping-method">
          <h4>Shipping Method</h4>
          <select 
            value={shippingMethod}
            onChange={(e) => setShippingMethod(e.target.value)}
          >
            <option value="standard">Standard Delivery - $5.99</option>
            <option value="express">Express Delivery - $14.99</option>
            <option value="overnight">Overnight Delivery - $24.99</option>
          </select>
        </div>

        <div className="summary-details">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(calculateSubtotal())}</span>
          </div>
          {promoApplied && (
            <div className="summary-row promo-discount">
              <span>Promo Discount ({promoCode})</span>
              <span>-{formatPrice(promoDiscount)}</span>
            </div>
          )}
          <div className="summary-row">
            <span>Shipping</span>
            <span>{calculateShipping() === 0 ? 'FREE' : formatPrice(calculateShipping())}</span>
          </div>
          <div className="summary-row">
            <span>Estimated Tax</span>
            <span>{formatPrice(calculateTax())}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>{formatPrice(calculateTotal())}</span>
          </div>
        </div>

        <button 
          onClick={handleCheckout}
          className="checkout-btn"
          disabled={!cartItems.length}
        >
          Proceed to Checkout
        </button>

        <div className="secure-checkout">
          <p>🔒 Secure Checkout</p>
          <div className="payment-methods">
            <img src={visaIcon} alt="Visa" onError={(e) => e.target.style.display = 'none'} />
            <img src={mastercardIcon} alt="Mastercard" onError={(e) => e.target.style.display = 'none'} />
            <img src={amexIcon} alt="American Express" onError={(e) => e.target.style.display = 'none'} />
            <img src={paypalIcon} alt="PayPal" onError={(e) => e.target.style.display = 'none'} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItems; 