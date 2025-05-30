// src/components/Layout/Layout.jsx
import React from 'react';
// IMPORT Outlet from react-router-dom
import { NavLink, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

function Layout() { // No longer needs to accept { children } as a prop for this App.jsx setup
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
              {/* Add more navigation links here */}
            </ul>
          </nav>
        </div>
        <div className="sidebar-footer">
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* RENDER THE OUTLET FOR NESTED ROUTES HERE */}
        <Outlet /> 
      </main>
    </div>
  );
}

export default Layout;