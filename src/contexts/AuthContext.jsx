// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveCurrentUser, loadCurrentUser, removeCurrentUser, getAllUsers } from '../components/utils/localStorageUtils';
// No need to import useNavigate here, it's used in LoginForm.jsx

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // To indicate if auth state is still loading

  // Load current user from local storage when the app starts
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await loadCurrentUser();
        if (storedUser) {
          setCurrentUser(storedUser);
          console.log('User found in local storage:', storedUser.email);
        } else {
          console.log('No user found in local storage.');
        }
      } catch (error) {
        console.error('Error loading current user from local storage:', error);
      } finally {
        setLoading(false); // Authentication initialization is complete
      }
    };
    initializeAuth();
  }, []);

  const login = async (email, password) => {
    setLoading(true); // Indicate login process
    try {
      const users = await getAllUsers(); // Get all mock users
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        setCurrentUser(user);
        await saveCurrentUser(user); // Persist user to local storage
        console.log('Login successful for:', user.email);
        setLoading(false);
        return true; // Indicate successful login
      } else {
        console.warn('Login failed: Invalid credentials for', email);
        setLoading(false);
        return false; // Indicate failed login
      }
    } catch (error) {
      console.error('Error during login:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setCurrentUser(null);
      await removeCurrentUser(); // Remove user from local storage
      console.log('User logged out.');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Helper function for role-based access control (will be useful later)
  const hasRole = (roles) => {
    if (!currentUser) return false;
    // Ensure roles is an array for consistent checking
    const rolesArray = Array.isArray(roles) ? roles : [roles];
    return rolesArray.includes(currentUser.role);
  };

  const value = {
    currentUser, // The currently logged-in user object
    login,       // Function to log in
    logout,      // Function to log out
    hasRole,     // Function to check user roles
    loadingAuth: loading, // Boolean to indicate if authentication state is being loaded
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};