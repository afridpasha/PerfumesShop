import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import '../styles/CallToAction.css';

const CallToAction = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { data } = await axios.post(`${config.API_URL}/newsletter/subscribe`, { email });
      setMessage(data.message);
      setEmail('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="cta-section">
      <div className="cta-container">
        <div className="cta-content">
          <h2>Join Our Fragrance Club</h2>
          <p>
            Subscribe to receive exclusive offers, early access to new releases, 
            and personalized fragrance recommendations.
          </p>
          <form className="subscription-form" onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="email-input" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
            <button type="submit" className="subscribe-button" disabled={loading}>
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
          {message && <p className="subscription-message">{message}</p>}
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
