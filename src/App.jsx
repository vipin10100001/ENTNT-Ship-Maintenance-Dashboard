// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipsPage from './pages/ShipsPage';
import ShipDetailPage from './pages/ShipDetailPage';
import JobsPage from './pages/JobsPage';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ShipsProvider } from '@/contexts/ShipsContext';
import { ComponentsProvider } from '@/contexts/ComponentsContext';
import { JobsProvider } from '@/contexts/JobsContext';

import Layout from '@/components/Layout/Layout';

// ProtectedRoute component to guard routes
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loadingAuth, hasRole } = useAuth();

  if (loadingAuth) {
    return <div className="loading-fullscreen">Loading application...</div>;
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

  if (loadingAuth) {
    return <div className="loading-fullscreen">Loading authentication...</div>;
  }

  return (
    <ShipsProvider>
      <ComponentsProvider>
        <JobsProvider>
          <div className="app-container">
            <Routes>
              {/* Public Route */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Inspector', 'Engineer']}>
                    <Layout>
                      <DashboardPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ships"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Inspector', 'Engineer']}>
                    <Layout>
                      <ShipsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/ships/:id"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Inspector', 'Engineer']}>
                    <Layout>
                      <ShipDetailPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/jobs"
                element={
                  <ProtectedRoute allowedRoles={['Admin', 'Inspector', 'Engineer']}>
                    <Layout>
                      <JobsPage />
                    </Layout>
                  </ProtectedRoute>
                }
              />

              {/* Redirect root based on auth */}
              <Route
                path="/"
                element={currentUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
              />

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </JobsProvider>
      </ComponentsProvider>
    </ShipsProvider>
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
