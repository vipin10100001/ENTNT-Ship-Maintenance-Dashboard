// src/components/Layout/Layout.jsx
import React from 'react';

import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function Layout() { // Main layout component for the application
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="sidebar-logo">Entnt Ship</div>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/ships" className={({ isActive }) => isActive ? 'active' : ''}>
                  Ships
                </NavLink>
              </li>
              <li>
                <NavLink to="/jobs" className={({ isActive }) => isActive ? 'active' : ''}>
                  Jobs
                </NavLink>
              </li>
              
            </ul>
          </nav>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        <Outlet /> 
      </main>
    </div>
  );
}

export default Layout;