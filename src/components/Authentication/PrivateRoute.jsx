// src/components/Authentication/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Assuming your AuthContext is at src/contexts/AuthContext.jsx

function PrivateRoute({ children, allowedRoles }) {
  const { currentUser, loading } = useAuth(); 

  if (loading) {
    return <div className="loading-fullscreen">Authenticating user...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    if (!currentUser.role || !allowedRoles.includes(currentUser.role)) {
      console.warn(`Access denied for user role: ${currentUser.role}. Required roles: ${allowedRoles.join(', ')}`);
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children ? children : <Outlet />;
}

export default PrivateRoute;