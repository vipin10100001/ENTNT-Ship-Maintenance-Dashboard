// src/components/Layout/Layout.jsx
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // Assuming AuthContext is needed for logout

function Layout({ children }) { // Accepts children prop
  const { logout } = useAuth(); // Destructure logout from useAuth
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Call the logout function from AuthContext
    navigate('/login'); // Redirect to login page after logout
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
        {children} {/* This is where DashboardPage, ShipsPage, etc., will be rendered */}
      </main>
    </div>
  );
}

export default Layout;