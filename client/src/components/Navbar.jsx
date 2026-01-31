import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaBoxOpen } from 'react-icons/fa';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const { cartItems } = useContext(CartContext);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCartClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/cart');
  };

  const handleOrdersClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/orders');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✦</span>
          Perfume Shop
        </Link>

        <button 
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </div>

        <div className={`navbar-actions ${isMenuOpen ? 'active' : ''}`}>
          <button onClick={handleOrdersClick} className="nav-action-btn orders-btn">
            <FaBoxOpen />
            <span>Orders</span>
          </button>
          
          <button onClick={handleCartClick} className="nav-action-btn cart-btn">
            <FaShoppingCart />
            <span>Cart</span>
            {cartItems?.length > 0 && (
              <span className="cart-count">{cartItems.length}</span>
            )}
          </button>

          <div className="navbar-auth">
            {user ? (
              <>
                <span className="user-name">Welcome, {user.fullName}</span>
                <button onClick={handleLogout} className="auth-btn logout-btn">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="auth-btn login-btn">Login</Link>
                <Link to="/register" className="auth-btn register-btn">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
