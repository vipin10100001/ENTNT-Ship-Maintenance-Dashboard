// src/contexts/AuthContext.jsx (Add this if missing to expose all users)
import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveCurrentUser, loadCurrentUser, removeCurrentUser, getAllUsers, getUserByEmail } from '@/utils/localStorageUtils'; // Import getAllUsers

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // State to hold all users
  const [error, setError] = useState(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = await loadCurrentUser();
        setCurrentUser(storedUser);
        const allSystemUsers = await getAllUsers(); // Load all users
        setUsers(allSystemUsers);
      } catch (err) {
        console.error("Failed to initialize auth or load users:", err);
        setError("Authentication initialization failed.");
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email, password) => {
    setError(null);
    try {
      const allSystemUsers = await getAllUsers(); // Get all users again for login check
      const user = allSystemUsers.find(u => u.email === email && u.password === password);
      if (user) {
        await saveCurrentUser(user);
        setCurrentUser(user);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError("Login failed due to an error.");
      return false;
    }
  };

  const logout = async () => {
    await removeCurrentUser();
    setCurrentUser(null);
  };

  const hasRole = (roles) => {
    if (!currentUser) return false;
    if (Array.isArray(roles)) {
      return roles.includes(currentUser.role);
    }
    return currentUser.role === roles;
  };

  const value = {
    currentUser,
    users, // Expose all users
    loading,
    error,
    login,
    logout,
    hasRole,
    getUserById: (id) => users.find(user => user.id === id), // Helper to get user by ID
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