// src/components/Layout/Layout.jsx
import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Using alias

function Layout() {
  const { currentUser, logout, hasRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  if (!currentUser) {
    return null; // Should be handled by ProtectedRoute, but good for safety
  }

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <div className="sidebar">
        <div>
          <div className="sidebar-logo">ENTNT</div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
                  Dashboard
                </NavLink>
              </li>
              {hasRole(['Admin', 'Inspector']) && ( // Example RBAC for menu items
                <li>
                  <NavLink to="/ships" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Ships
                  </NavLink>
                </li>
              )}
              {hasRole(['Admin', 'Engineer']) && (
                <li>
                  <NavLink to="/jobs" className={({ isActive }) => (isActive ? 'active' : '')}>
                    Maintenance Jobs
                  </NavLink>
                </li>
              )}
              {/* Add more navigation links here */}
            </ul>
          </nav>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout}>Logout ({currentUser.email})</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="main-content">
        <header className="main-content-header">
          <h2>{/* Dynamically display page title based on route */}</h2>
          {/* You can add user info/profile dropdown here */}
        </header>
        <Outlet /> {/* This is where nested route components will render */}
      </div>
    </div>
  );
}

export default Layout;