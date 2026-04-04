import axios from 'axios';

const API = axios.create({
   baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// THIS IS THE CRITICAL PART:
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Some versions of Axios prefer setting it this way to avoid overwriting defaults
    req.headers['Authorization'] = `Bearer ${token}`;
  }
  return req;
});

export default API;