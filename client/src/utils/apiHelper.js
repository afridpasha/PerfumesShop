import config from '../config';

// Get API base URL
export const getApiUrl = (endpoint = '') => {
  const baseUrl = config.API_URL.replace('/api', '');
  return `${baseUrl}${endpoint}`;
};

// Get full API endpoint
export const getApiEndpoint = (path) => {
  return `${config.API_URL}${path}`;
};

export default { getApiUrl, getApiEndpoint };
