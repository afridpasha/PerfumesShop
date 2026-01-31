// Format price with currency symbol
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

// Truncate text with ellipsis
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

// Calculate rating stars
export const calculateRatingStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return {
    full: fullStars,
    half: hasHalfStar ? 1 : 0,
    empty: emptyStars
  };
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const userInfo = localStorage.getItem('userInfo');
  return !!userInfo;
};

// Check if user is admin
export const isAdmin = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return false;
  
  return JSON.parse(userInfo).isAdmin === true;
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const userInfo = localStorage.getItem('userInfo');
  if (!userInfo) return null;
  
  return JSON.parse(userInfo);
};
  