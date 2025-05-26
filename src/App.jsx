// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import { AuthProvider, useAuth } from '/src/components/contexts/AuthContext'; // THIS IMPORT IS KEY
// import DashboardPage from './pages/DashboardPage'; // Will be uncommented later

// ProtectedRoute component to guard routes (simple version)
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, loadingAuth, hasRole } = useAuth();

  if (loadingAuth) {
    // Optionally render a loading spinner or splash screen here
    return <div>Loading application...</div>;
  }

  if (!currentUser) {
    // Redirect to login if no user is authenticated
    return <Navigate to="/login" replace />;
  }

  // If roles are specified, check if the user has one of them
  if (allowedRoles && !hasRole(allowedRoles)) {
    // Optionally redirect to an unauthorized page or dashboard
    console.warn(`User ${currentUser.email} (${currentUser.role}) not authorized for this page.`);
    return <Navigate to="/dashboard" replace />; // Redirect to dashboard or an access denied page
  }

  return children;
};


function AppContent() {
  const { currentUser, loadingAuth } = useAuth(); // Access auth state

  // This will be used to determine the initial redirect
  const isAuthenticated = !!currentUser;

  if (loadingAuth) {
    return <div>Loading authentication...</div>; // Or a more complex loading UI
  }

  return (
    <div className="app-container">
      <Routes>
        {/* Public route for Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected routes (example structure) */}
        {/*
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['Admin', 'Inspector', 'Engineer']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        */}

        {/* Redirect based on authentication status */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />}
        />

        {/* Catch-all for undefined routes, redirects to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider> {/* Wrap the whole app content with AuthProvider */}
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;