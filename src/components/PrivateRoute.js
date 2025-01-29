// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// Mock authentication function
const isAuthenticated = () => {
  // Replace with real authentication logic
  return true; // or false based on auth state
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
