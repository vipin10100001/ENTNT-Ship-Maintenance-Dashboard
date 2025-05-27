// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // <--- IMPORT DASHBOARD PAGE
import { AuthProvider, useAuth } from '@/contexts/AuthContext';

// ProtectedRoute component to guard routes (simple version)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loadingAuth, hasRole } = useAuth();

  if (loadingAuth) {
    return <div>Loading application...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    console.warn(`User ${currentUser.email} (${currentUser.role}) not authorized for this page.`);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};


function AppContent() {
  const { currentUser, loadingAuth } = useAuth();
  const isAuthenticated = !!currentUser;

  if (loadingAuth) {
    return <div>Loading authentication...</div>;
  }

  return (
    <div className="app-container">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected dashboard route (UNCOMMENT THIS) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inspector', 'Engineer']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        {/* Redirect based on authentication status */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all for undefined routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;