import axios from 'axios';
import config from '../config';

// Create an Axios instance with base URL and default headers
const API = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
API.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Perfume API calls
export const fetchPerfumes = async () => {
  try {
    console.log('Attempting to fetch perfumes...');
    const { data } = await API.get('/perfumes');
    console.log('Perfume data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching perfumes:', error);
    console.error('Error details:', error.response ? error.response.data : 'No response data');
    console.error('Status code:', error.response ? error.response.status : 'No status code');
    throw error;
  }
};

// For backward compatibility - alias of fetchPerfumes
export const fetchProducts = async () => {
  console.log('fetchProducts called - redirecting to fetchPerfumes');
  return fetchPerfumes();
};

export const fetchPerfumeById = async (id) => {
  try {
    const { data } = await API.get(`/perfumes/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching perfume ${id}:`, error);
    throw error;
  }
};

export const fetchTopPerfumes = async () => {
  try {
    const { data } = await API.get('/perfumes/top');
    return data;
  } catch (error) {
    console.error('Error fetching top perfumes:', error);
    throw error;
  }
};

// User API calls
export const login = async (email, password) => {
  try {
    const { data } = await API.post('/auth/login', { email, password });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const register = async (fullName, email, password, phoneNumber) => {
  try {
    const { data } = await API.post('/auth/register', { fullName, email, password, phoneNumber });
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('userInfo');
};

export const getUserProfile = async () => {
  try {
    const { data } = await API.get('/users/profile');
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const { data } = await API.put('/users/profile', userData);
    localStorage.setItem('userInfo', JSON.stringify(data));
    return data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// Review API call
export const createPerfumeReview = async (perfumeId, review) => {
  try {
    const { data } = await API.post(`/perfumes/${perfumeId}/reviews`, review);
    return data;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};
