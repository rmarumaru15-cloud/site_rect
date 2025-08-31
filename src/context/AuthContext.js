import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Set up axios to send credentials (cookies) with every request
axios.defaults.withCredentials = true;
const API_BASE_URL = 'http://localhost:5000'; // Backend server URL

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if the user is already logged in (session check)
    const checkLoggedIn = async () => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/api/me`);
        setUser(data);
      } catch (err) {
        console.log('Not logged in');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  const login = async (credentialResponse) => {
    try {
      const { data } = await axios.post(`${API_BASE_URL}/api/auth/google`, {
        token: credentialResponse.credential,
      });
      setUser(data);
    } catch (err) {
      console.error('Login failed:', err);
      setUser(null);
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/auth/logout`);
      setUser(null);
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const value = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
