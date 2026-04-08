// contexts/AuthProvider.jsx
import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import API from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
  try {
    setLoading(true);   // 👈 use here
    const response = await API.get('/auth/me'); 
    setUser(response.data);
  } catch (error) {
    if (error.response?.status === 401) {
      console.error('Session expired or invalid token.');
      localStorage.removeItem('token');
    }
  } finally {
    setLoading(false); // 👈 and here
  }
};
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
  fetchUser();
}, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};