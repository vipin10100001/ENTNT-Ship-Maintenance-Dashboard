import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator

  const { login } = useAuth(); // Destructure the login function from AuthContext
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    setError(''); // Clear any previous error messages
    setLoading(true); // Set loading to true when login process starts

    try {
      // Call the login function from AuthContext
      // The login function is expected to return true on success, false on failure
      const success = await login(email, password);

      if (success) {
        console.log('Login successful, navigating to dashboard...');
        // Redirect to the dashboard page on successful login
        // 'replace: true' prevents going back to login page with browser back button
        navigate('/dashboard', { replace: true }); 
      } else {
        // If login failed (e.g., incorrect credentials), set an error message
        setError('Invalid email or password. Please try again.');
        console.warn('Login failed for', email);
      }
    } catch (err) {
      // Catch any unexpected errors during the login process (e.g., network issues)
      console.error("An unexpected error occurred during login:", err);
      setError('An unexpected error occurred during login. Please try again.');
    } finally {
      // Ensure loading state is reset regardless of success or failure
      setLoading(false); 
    }
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
            placeholder="e.g., admin@entnt.in" // Example placeholder for user guidance
            required // HTML5 validation: field is required
            disabled={loading} // Disable input while loading
            autoComplete="username" // Helps browsers with autofill
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123" // Example placeholder for user guidance
            required // HTML5 validation: field is required
            disabled={loading} // Disable input while loading
            autoComplete="current-password" // Helps browsers with autofill
          />
        </div>
        {/* Display error message if 'error' state is not empty */}
        {error && <p className="error-message">{error}</p>} 
        
        <button type="submit" disabled={loading}>
          {/* Change button text based on loading state */}
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;