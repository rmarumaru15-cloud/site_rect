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

  const login = () => {
    // NOTE: This is a mock login function for testing purposes.
    const mockUser = {
      name: 'Test User',
      avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', // A random avatar
    };
    setUser(mockUser);
    console.log('Logged in as Test User.');
  };

  const logout = () => {
    // NOTE: This is a mock logout function for testing purposes.
    setUser(null);
    console.log('Logged out.');
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
