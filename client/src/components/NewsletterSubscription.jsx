import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import './NewsletterSubscription.scss';

const NewsletterSubscription = () => {
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
    <div className="newsletter-subscription">
      <h2>Join Our Fragrance Club</h2>
      <p>Subscribe to receive exclusive offers, early access to new releases, and personalized fragrance recommendations.</p>
      
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default NewsletterSubscription;
