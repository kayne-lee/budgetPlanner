import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ element }) {
  const isAuthenticated = localStorage.getItem("authToken") !== null;

  return isAuthenticated ? element : <Navigate to="/login" />;
}

export default PrivateRoute;
