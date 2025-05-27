// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
// FIX: Corrected import names from localStorageUtils
import { loadCurrentUser, saveCurrentUser, removeCurrentUser, getUserByEmail, getAllUsers } from '@/utils/localStorageUtils';
// FIX: Corrected import from roleUtils to use the specific checks
import { isUserAdmin, isUserInspector, isUserEngineer, hasRequiredRole, USER_ROLES } from '@/utils/roleUtils';


const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const loadUserFromLocalStorage = async () => {
      try {
        const storedUser = await loadCurrentUser(); // Use loadCurrentUser for the session
        if (storedUser) {
          setCurrentUser(storedUser);
          console.log("User found in local storage: " + storedUser.email);
        } else {
            setCurrentUser(null);
        }
      } catch (error) {
        console.error("Failed to load user from local storage:", error);
        setCurrentUser(null);
      } finally {
        setLoadingAuth(false);
      }
    };

    loadUserFromLocalStorage();
  }, []);

  const login = async (email, password) => {
    setLoadingAuth(true); // Indicate login process start
    try {
      const users = await getAllUsers(); // Get all mock users to find match
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        setCurrentUser(user);
        await saveCurrentUser(user); // Save the logged-in user to current session
        console.log('Login successful for:', user.email);
        return true; // Indicate successful login
      } else {
        console.warn('Login failed: Invalid credentials for', email);
        return false; // Indicate failed login
      }
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    } finally {
        setLoadingAuth(false); // Indicate login process end
    }
  };


  const logout = async () => {
    setLoadingAuth(true); // Indicate logout process start
    try {
      setCurrentUser(null);
      await removeCurrentUser(); // Remove current user from local storage
      console.log('User logged out.');
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoadingAuth(false); // Indicate logout process end
    }
  };

  const hasRole = (roles) => {
    // FIX: Using the hasRequiredRole from roleUtils for consistency and flexibility
    return hasRequiredRole(currentUser, roles);
  };


  const value = {
    currentUser,
    login,
    logout,
    loadingAuth,
    hasRole,
    // You can also expose specific role checks if needed, but hasRole is more generic
    isUserAdmin: (user) => isUserAdmin(user || currentUser),
    isUserInspector: (user) => isUserInspector(user || currentUser),
    isUserEngineer: (user) => isUserEngineer(user || currentUser),
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