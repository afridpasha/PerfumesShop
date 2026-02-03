import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { CartContext } from '../context/CartContext';
import '../styles/ProductCard.css';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  if (!product) {
    return null;
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      addToCart(product);
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (error.message.includes('login')) {
        navigate('/login');
      }
    }
  };

  const productId = product._id || product.id;
  const productImage = product.image || product.imageUrl || 'https://via.placeholder.com/300x300?text=Perfume';
  const productName = product.name || 'Product Name';
  const productBrand = product.brand || 'Brand';
  const productPrice = product.price || 0;
  const productDescription = product.description || product.shortDescription || 'No description available';

  return (
    <div className="product-card">
      <div className="product-image">
        <img 
          src={productImage} 
          alt={productName}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/300x300?text=Perfume';
          }}
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{productName}</h3>
        <p className="product-brand">{productBrand}</p>
        <p className="product-size">{product.size || '50ml'}</p>
        <p className="product-price">{formatPrice(productPrice)}</p>
        <p className="product-description">{productDescription.substring(0, 80)}...</p>
      </div>
      <div className="product-actions">
        <Link to={`/product/${productId}`} className="view-details-btn">View Details</Link>
        <button className="add-to-cart-btn" onClick={handleAddToCart}>Add to Cart</button>
      </div>
    </div>
  );
};

export default ProductCard;
