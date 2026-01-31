import React, { useEffect, useState } from 'react';
import '../styles/Products.css';
import ProductCard from '../components/ProductCard';
import { fetchPerfumes } from '../utils/api';

const Products = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perfumes, setPerfumes] = useState([]);
  const [filteredPerfumes, setFilteredPerfumes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadPerfumes = async () => {
      try {
        setLoading(true);
        const data = await fetchPerfumes();
        if (data && Array.isArray(data)) {
          setPerfumes(data);
          setFilteredPerfumes(data);
        } else {
          setError('No perfumes found');
        }
        setLoading(false);
      } catch (err) {
        console.error('Error loading perfumes:', err);
        setError('Failed to load perfumes. Please try again later.');
        setLoading(false);
      }
    };

    loadPerfumes();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...perfumes];
    
    // Apply category filter
    if (filter !== 'all') {
      result = result.filter(perfume => perfume.category === filter);
    }
    
    // Apply search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        perfume => 
          perfume.name.toLowerCase().includes(term) || 
          (perfume.description && perfume.description.toLowerCase().includes(term)) ||
          (perfume.brand && perfume.brand.toLowerCase().includes(term))
      );
    }
    
    setFilteredPerfumes(result);
  }, [filter, searchTerm, perfumes]);

  const categories = ['all', ...new Set(perfumes.map(perfume => perfume.category))].filter(Boolean);

  if (loading) {
    return <div className="loading">Loading perfumes...</div>;
  }

  return (
    <div className="products-container">
      <div className="products-header">
        <h1>Our Perfume Collection</h1>
        <p>Discover your perfect scent from our exclusive collection</p>
      </div>

      <div className="filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search perfumes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`filter-btn ${filter === category ? 'active' : ''}`}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      )}

      <div className="products-grid">
        {filteredPerfumes.length > 0 ? (
          filteredPerfumes.map(perfume => (
            <ProductCard key={perfume._id || perfume.id} product={perfume} />
          ))
        ) : (
          <div className="no-results">
            <p>No perfumes found. Try different search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products; 