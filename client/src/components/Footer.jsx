import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <h3>Perfume Shop</h3>
            <p className="footer-about">
              Discover your signature scent with our curated collection of premium fragrances for every occasion.
            </p>
            <div className="social-links">
              <button type="button" aria-label="Facebook"><i className="social-icon">📘</i></button>
              <button type="button" aria-label="Instagram"><i className="social-icon">📸</i></button>
              <button type="button" aria-label="Twitter"><i className="social-icon">🐦</i></button>
              <button type="button" aria-label="Pinterest"><i className="social-icon">📌</i></button>
            </div>
          </div>
          
          <div className="footer-column">
            <h4>Shop</h4>
            <ul>
              <li><Link to="/products">All Fragrances</Link></li>
              <li><Link to="/products">New Arrivals</Link></li>
              <li><Link to="/products">Best Sellers</Link></li>
              <li><Link to="/products">Gift Sets</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Information</h4>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/">Shipping Policy</Link></li>
              <li><Link to="/">Returns & Refunds</Link></li>
            </ul>
          </div>
          
          <div className="footer-column">
            <h4>Contact Us</h4>
            <p>123 Fragrance Boulevard</p>
            <p>New York, NY 10001</p>
            <p>+1 (800) 123-4567</p>
            <p>info@perfumeshop.com</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Perfume Shop. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <button type="button">Privacy Policy</button>
            <button type="button">Terms of Service</button>
            <button type="button">Sitemap</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 