// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/Authentication/PrivateRoute'; // Correct path to PrivateRoute
import Layout from './components/Layout/Layout';

// Contexts
import { AuthProvider } from './contexts/AuthContext';
import { ShipsProvider } from './contexts/ShipsContext';
import { ComponentsProvider } from './contexts/ComponentsContext';
import { JobsProvider } from './contexts/JobsContext';

// Notification Context and Component
import { NotificationProvider } from './contexts/NotificationContext';
import NotificationCenter from './components/Notifications/NotificationCenter';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ShipsPage from './pages/ShipsPage';
import ShipDetailPage from './pages/ShipDetailPage';
import JobsPage from './pages/JobsPage';
import NotFoundPage from './pages/NotFoundPage';
// If you uncommented the JobCalendar route, ensure you import it here:
// import JobCalendar from './components/Jobs/JobCalendar';

function App() {
  return (
    <Router>
      
      <AuthProvider>
       
        <NotificationProvider>
          
          <NotificationCenter />

          
          <ShipsProvider>
            <ComponentsProvider>
              <JobsProvider>

                <Routes>
                  <Route path="/login" element={<LoginPage />} />

                  {/* PrivateRoute wraps routes that require authentication and the Layout */}
                  <Route
                    path="/"
                    element={
                      <PrivateRoute>
                        <Layout />
                      </PrivateRoute>
                    }
                  >
                    {/* Nested routes for the dashboard content */}
                    <Route index element={<DashboardPage />} /> {/* Default route for / */}
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="ships" element={<ShipsPage />} />
                    <Route path="ships/:id" element={<ShipDetailPage />} />
                    <Route path="jobs" element={<JobsPage />} />
                    {/* If you prefer a separate calendar route, uncomment this: */}
                    {/* <Route path="jobs/calendar" element={<JobCalendar />} /> */}
                  </Route>

                  {/* Catch-all route for 404 Not Found */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>

              </JobsProvider>
            </ComponentsProvider>
          </ShipsProvider>

        </NotificationProvider> {/* End NotificationProvider */}
      </AuthProvider>
    </Router>
  );
}

export default App;