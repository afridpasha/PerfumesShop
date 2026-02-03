import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import config from '../config';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${config.API_URL}/perfumes/${id}`);
        if (!response.ok) {
          throw new Error('Product not found');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product detail:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      addToCart(product, quantity);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message.includes('login')) {
        navigate('/login');
      }
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  if (loading) {
    return <div className="product-detail-loading">Loading product details...</div>;
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <h2>Product Not Found</h2>
        <p>{error || "We couldn't find the product you're looking for."}</p>
        <button onClick={() => navigate('/products')} className="back-to-products">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail-container">
      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img 
            src={product.image || 'https://via.placeholder.com/600x600?text=Perfume'} 
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/600x600?text=Perfume';
            }}
          />
        </div>
        
        <div className="product-detail-info">
          <h1 className="product-detail-name">{product.name}</h1>
          <p className="product-detail-brand">{product.brand}</p>
          <div className="product-detail-price">{formatPrice(product.price)}</div>
          
          <div className="product-detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-detail-meta">
            <div className="meta-item">
              <span className="meta-label">Concentration:</span>
              <span className="meta-value">{product.concentration}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Size:</span>
              <span className="meta-value">{product.size || '50ml'}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Gender:</span>
              <span className="meta-value">{product.gender || 'Unisex'}</span>
            </div>
          </div>
          
          <div className="product-detail-actions">
            <div className="quantity-controls">
              <span className="quantity-label">Quantity:</span>
              <div className="quantity-input">
                <button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  className="quantity-btn"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-value">{quantity}</span>
                <button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>
            
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
          
          <div className="product-detail-shipping">
            <p>Free shipping on orders over $100</p>
            <p>30-day returns</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 