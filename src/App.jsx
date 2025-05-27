// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipsPage from './pages/ShipsPage'; // Import new pages
import ShipDetailPage from './pages/ShipDetailPage';
import JobsPage from './pages/JobsPage';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ShipsProvider } from '@/contexts/ShipsContext'; // Import other providers
import { ComponentsProvider } from '@/contexts/ComponentsContext';
import { JobsProvider } from '@/contexts/JobsContext';

import Layout from '@/components/Layout/Layout'; // Import the new Layout component

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
  const { loadingAuth } = useAuth();

  if (loadingAuth) {
    return <div className="loading-fullscreen">Loading authentication...</div>;
  }

  return (
    // Wrap all routes within context providers
    <ShipsProvider>
      <ComponentsProvider>
        <JobsProvider>
          <div className="app-container"> {/* This container manages overall app layout */}
            <Routes>
              {/* Public route for Login */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes wrapped in Layout */}
              <Route element={<ProtectedRoute allowedRoles={['Admin', 'Inspector', 'Engineer']} />}>
                <Route element={<Layout />}> {/* Use Layout for all protected routes */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/ships" element={<ShipsPage />} />
                  <Route path="/ships/:id" element={<ShipDetailPage />} />
                  <Route path="/jobs" element={<JobsPage />} />
                </Route>
              </Route>

              {/* Redirect root to dashboard if authenticated, otherwise to login */}
              <Route
                path="/"
                element={
                  <Navigate to={loadingAuth ? '/login' : (useAuth().currentUser ? '/dashboard' : '/login')} replace />
                }
              />

              {/* Catch-all for undefined routes, redirects to login */}
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