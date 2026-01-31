import React from 'react';

function ProductDetails({ product }) {
  return (
    <div className="product-details">
      <h2>{product.name}</h2>
      <p>{product.fullDescription}</p>
      <p className="price">${product.price}</p>
      <div className="sizes">
        <strong>Sizes:</strong>{' '}
        {product.sizes && product.sizes.map((size, index) => (
          <span key={index} className="size">
            {size}
          </span>
        ))}
      </div>
    </div>
  );
}

export default ProductDetails;
