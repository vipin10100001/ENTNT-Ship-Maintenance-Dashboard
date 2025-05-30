// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

function NotFoundPage() {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px', padding: '20px' }}>
      <h1 style={{ fontSize: '3rem', color: '#dc3545' }}>404 - Page Not Found</h1>
      <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>The page you are looking for does not exist.</p>
      <Link to="/dashboard" style={{
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        textDecoration: 'none'
      }}>Go to Dashboard</Link>
    </div>
  );
}

export default NotFoundPage;