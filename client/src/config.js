// Environment configuration
const config = {
  API_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  STRIPE_KEY: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY
};

export default config;
