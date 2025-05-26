// src/pages/LoginPage.jsx
import React from 'react';
import LoginForm from '../components/Authentication/LoginForm';

function LoginPage() {
  return (
    <div className="login-page-container">
      <h1 className="app-title">ENTNT Ship Maintenance Dashboard</h1>
      <LoginForm />
    </div>
  );
}

export default LoginPage;