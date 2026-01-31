// client/src/components/Reviews.jsx
import React, { useEffect, useState } from 'react';
import { fetchReviews, postReview } from '../utils/api';

const Reviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    setLoading(true);
    fetchReviews(productId)
      .then((data) => {
        setReviews(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching reviews:", err);
        setError(err);
        setLoading(false);
        // Fallback empty reviews
        setReviews([]);
      });
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;
    
    setSubmitStatus({ loading: true, error: null });
    try {
      const review = await postReview(productId, newReview);
      setReviews((prev) => [...prev, review]);
      setNewReview('');
      setSubmitStatus({ loading: false, error: null });
    } catch (error) {
      console.error("Error posting review:", error);
      setSubmitStatus({ loading: false, error: 'Failed to submit review. Please try again.' });
      // Mock a successful submission for development
      const mockReview = { _id: Date.now().toString(), text: newReview };
      setReviews((prev) => [...prev, mockReview]);
      setNewReview('');
    }
  };

  return (
    <div className="reviews">
      <h3>Customer Reviews</h3>
      
      {loading ? (
        <p>Loading reviews...</p>
      ) : error ? (
        <p>Unable to load reviews. Please try again later.</p>
      ) : (
        <>
          <ul>
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <li key={review._id || Math.random()}>{review.text}</li>
              ))
            ) : (
              <li className="no-reviews">No reviews yet. Be the first to review!</li>
            )}
          </ul>
          
          <form onSubmit={handleSubmit}>
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Add your review"
              required
              disabled={submitStatus.loading}
            />
            <button type="submit" disabled={submitStatus.loading || !newReview.trim()}>
              {submitStatus.loading ? 'Submitting...' : 'Submit Review'}
            </button>
            {submitStatus.error && <p className="error-message">{submitStatus.error}</p>}
          </form>
        </>
      )}
    </div>
  );
};

export default Reviews;