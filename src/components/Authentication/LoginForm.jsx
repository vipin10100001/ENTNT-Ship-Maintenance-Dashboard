// src/components/Authentication/LoginForm.jsx
import React, { useState } from 'react';
import { useAuth } from './components/context/AuthContext'; // Import useAuth
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth(); // Get the login function from AuthContext
  const navigate = useNavigate(); // Initialize navigate hook

  const handnleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
    setLoading(true);

    // Call the login function from AuthContext
    const success = await login(email, password);

    if (success) {
      console.log('Login successful, navigating to dashboard...');
      // Navigate to the dashboard or a default authenticated route
      navigate('/dashboard', { replace: true }); // Use replace to prevent back navigation to login
    } else {
      setError('Invalid email or password. Please try again.');
      console.warn('Login failed for', email);
    }
    setLoading(false);
  };

  return (
    <div className="login-form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g., admin@entnt.in"
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            required
            disabled={loading}
          />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;