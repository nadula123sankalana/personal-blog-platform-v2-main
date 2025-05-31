// client/src/contexts/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';

// Simple JWT decode helper to extract user info (optional)
const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (token) {
    const decoded = parseJwt(token);

    if (decoded && decoded.username) {
      setUser({
        id: decoded.userId || decoded.id,
        username: decoded.username,
        email: decoded.email,
        avatar: decoded.avatar,
      });
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  } else if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
}, []);


  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
