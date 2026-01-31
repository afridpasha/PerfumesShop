import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <div className="about-container">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>About Perfume Shop</h1>
          <p>Crafting exquisite fragrances since 2010</p>
        </div>
      </section>

      <section className="about-mission">
        <div className="about-section-content">
          <h2>Our Mission</h2>
          <p>
            At Perfume Shop, we believe that fragrance is more than just a scent—it's an expression of personality, 
            a trigger for memories, and a complement to one's unique style. Our mission is to provide the finest quality 
            perfumes that help our customers express themselves and create lasting impressions.
          </p>
        </div>
      </section>

      <section className="about-story">
        <div className="about-section-content">
          <h2>Our Story</h2>
          <p>
            Perfume Shop was established in 2010 by a team of passionate fragrance enthusiasts who wanted to bring 
            exclusive, high-quality scents to discerning consumers. What began as a small boutique in the heart 
            of the city has grown into a respected brand with international recognition.
          </p>
          <p>
            Our journey has been guided by our commitment to craftsmanship, ethical sourcing, and innovative fragrance 
            creation. Each perfume in our collection is crafted with care, using the finest ingredients from around the world.
          </p>
        </div>
      </section>

      <section className="about-values">
        <div className="about-section-content">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <h3>Quality</h3>
              <p>We source the finest ingredients and employ skilled perfumers to create exceptional fragrances.</p>
            </div>
            <div className="value-card">
              <h3>Sustainability</h3>
              <p>We are committed to ethical sourcing, eco-friendly packaging, and sustainable business practices.</p>
            </div>
            <div className="value-card">
              <h3>Innovation</h3>
              <p>We continually explore new scent combinations and techniques to create unique fragrances.</p>
            </div>
            <div className="value-card">
              <h3>Customer Experience</h3>
              <p>We strive to provide an exceptional shopping experience both online and in-store.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-team">
        <div className="about-section-content">
          <h2>Our Team</h2>
          <p>
            Behind Perfume Shop is Mohammad Afrid Pasha, the visionary founder and owner who brings passion 
            and expertise to creating extraordinary scents. His dedication to quality and innovation 
            ensures that our collection offers something for everyone.
          </p>
          <div className="team-members">
            <div className="team-member">
              <div className="member-photo" style={{ backgroundColor: '#f0e6f5' }}>MAP</div>
              <h3>Mohammad Afrid Pasha</h3>
              <p>Founder & Owner</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About; 