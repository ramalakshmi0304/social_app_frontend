import axios from "axios";

const API = axios.create({
  baseURL: "https://social-app-backend-ybpu.onrender.com/api",
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Use the .set() method or ensure headers exists
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;