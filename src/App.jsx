// src/pages/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexts and Utils (using @/ alias as they are direct subfolders of src/)
import { AuthProvider } from '@/contexts/AuthContext';
import { ShipsProvider } from '@/contexts/ShipsContext';
import { ComponentsProvider } from '@/contexts/ComponentsContext';
import { JobsProvider } from '@/contexts/JobsContext';
import { initializeMockData } from '@/utils/localStorageUtils';

// Components (relative path from src/pages/ to src/components/)
import PrivateRoute from '@/components/Authentication/PrivateRoute'; // Correct path based on your structure
import Layout from '@/components/Layout/Layout'; // Correct path

// Pages (relative path within src/pages/)
import LoginPage from '@/pages/LoginPage';
import DashboardPage from '@/pages/DashboardPage';
import ShipsPage from '@/pages/ShipsPage';
import ShipDetailPage from '@/pages/ShipDetailPage';
import JobsPage from '@/pages/JobsPage';
import NotFoundPage from '@/pages/NotFoundPage'; // Correct path assuming it's in src/pages/

function App() {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <ShipsProvider>
          <ComponentsProvider>
            <JobsProvider>
              <Routes>
                <Route path="/login" element={<LoginPage />} />

                {/* Protected Routes wrapped in PrivateRoute and Layout */}
                <Route
                  path="/" // This route captures all paths that are not /login or /dashboard directly
                  element={
                    <PrivateRoute>
                      <Layout />
                    </PrivateRoute>
                  }
                >
                  {/* Nested routes will render inside Layout's {children} */}
                  <Route index element={<DashboardPage />} /> {/* Default route for / */}
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="ships" element={<ShipsPage />} />
                  <Route path="ships/:id" element={<ShipDetailPage />} />
                  <Route path="jobs" element={<JobsPage />} />
                  {/* Add more protected routes here as you implement them */}
                </Route>

                {/* Fallback for unauthenticated root or unmatched routes */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </JobsProvider>
          </ComponentsProvider>
        </ShipsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;