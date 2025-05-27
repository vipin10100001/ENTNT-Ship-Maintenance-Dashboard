// src/pages/DashboardPage.jsx
import React from 'react';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth to show current user and logout
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true }); // Redirect to login after logout
  };

  if (!currentUser) {
    // Should theoretically be handled by ProtectedRoute, but a fallback is good
    return <div>Not authenticated. Redirecting...</div>;
  }

  return (
    <div className="dashboard-page-container">
      <h1>Welcome to the Dashboard, {currentUser.role}!</h1>
      <p>You are logged in as: {currentUser.email}</p>
      <button onClick={handleLogout}>Logout</button>
      <hr/>
      <h3>Ship Maintenance Dashboard Overview</h3>
      <p>This is where your KPIs Dashboard, Notifications, and main navigation will reside.</p>
      {/* Later, you'll add components like: */}
      {/* <KPICards /> */}
      {/* <Charts /> */}
      {/* <NotificationCenter /> */}
    </div>
  );
}

export default DashboardPage;