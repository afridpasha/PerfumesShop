// client/src/routes/Home.jsx
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Home.css';
import ProductCard from '../components/ProductCard';
import CallToAction from '../components/CallToAction';
import { fetchPerfumes, fetchTopPerfumes } from '../utils/api';

// Import images from assets folder
import image1 from '../assets/images/image1.jpg';
import image2 from '../assets/images/image2.png';
import image3 from '../assets/images/image3.jpeg';

const Home = () => {
  const [loading, setLoading] = useState(true);
  const [perfumes, setPerfumes] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: image1,
      title: 'Discover Your Signature Scent',
      subtitle: 'Explore our collection of premium fragrances'
    },
    {
      image: image2,
      title: 'Luxury Perfumes',
      subtitle: 'Crafted with the finest ingredients'
    },
    {
      image: image3,
      title: 'Elegant Collection',
      subtitle: 'Find your perfect fragrance'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Get featured perfumes (all perfumes for now, could be filtered)
        const perfumeData = await fetchPerfumes();
        console.log('Perfume data received:', perfumeData);
        setPerfumes(perfumeData);
        
        // Get top rated perfumes
        try {
          const topPerfumeData = await fetchTopPerfumes();
          // setTopPerfumes(topPerfumeData); // Commented out since not used
        } catch (topErr) {
          console.error('Error fetching top perfumes:', topErr);
          // No need to set main error, just log it
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error loading data:', err);
        // setError('Failed to load perfumes. Please try again later.'); // Commented out since not used
        setLoading(false);
        // Fallback data
        const fallbackData = [
          {
            id: 1,
            name: 'Floral Elegance',
            description: 'A delicate blend of rose and jasmine',
            price: 89.99,
            image: image1
          },
          {
            id: 2,
            name: 'Ocean Breeze',
            description: 'Fresh and invigorating marine scent',
            price: 75.50,
            image: image2
          },
          {
            id: 3,
            name: 'Midnight Mystery',
            description: 'Rich and sensual with woody undertones',
            price: 120.00,
            image: image3
          }
        ];
        setPerfumes(fallbackData);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // If API isn't available, use sample data
  const featuredPerfumes = perfumes.length > 0 ? perfumes.slice(0, 3) : [
    {
      id: 1,
      name: 'Floral Elegance',
      description: 'A delicate blend of rose and jasmine',
      price: 89.99,
      image: image1
    },
    {
      id: 2,
      name: 'Ocean Breeze',
      description: 'Fresh and invigorating marine scent',
      price: 75.50,
      image: image2
    },
    {
      id: 3,
      name: 'Midnight Mystery',
      description: 'Rich and sensual with woody undertones',
      price: 120.00,
      image: image3
    }
  ];

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="slider-container">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.image})`,
                transform: `scale(${index === currentSlide ? '1.1' : '1'})`,
                opacity: index === currentSlide ? 1 : 0
              }}
            />
          ))}
        </div>
        
        <div className="hero-content">
          <h1 className="hero-title">{slides[currentSlide].title}</h1>
          <p className="hero-subtitle">{slides[currentSlide].subtitle}</p>
          <Link to="/products" className="cta-button">
            Shop Now
          </Link>
        </div>

        <div className="slider-navigation">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="featured-section">
        <div className="section-title">
          <h2>Featured Fragrances</h2>
          <p>Our most popular scents</p>
        </div>
        <div className="products-grid">
          {featuredPerfumes.map(perfume => (
            <ProductCard key={perfume._id || perfume.id} product={perfume} />
          ))}
        </div>
      </section>

      <CallToAction />
    </div>
  );
};

export default Home;