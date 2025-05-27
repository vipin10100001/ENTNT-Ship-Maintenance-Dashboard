// src/utils/roleUtils.js
// This utility file will contain functions related to user roles and permissions.
// This is primarily used by AuthContext or directly in components for conditional rendering.

export const USER_ROLES = {
  ADMIN: 'Admin',
  INSPECTOR: 'Inspector',
  ENGINEER: 'Engineer',
};

/**
* Checks if a user has a specific role or any of a list of roles.
* @param {object} user - The current user object.
* @param {string|string[]} requiredRoles - The role(s) to check against.
* @returns {boolean} - True if the user has the required role(s), false otherwise.
*/
export const hasRequiredRole = (user, requiredRoles) => {
  if (!user || !user.role) {
      return false;
  }
  if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
  }
  return user.role === requiredRoles;
};

// Explicitly exported functions for specific role checks, as requested
export const isUserAdmin = (user) => hasRequiredRole(user, USER_ROLES.ADMIN);
export const isUserInspector = (user) => hasRequiredRole(user, USER_ROLES.INSPECTOR);
export const isUserEngineer = (user) => hasRequiredRole(user, USER_ROLES.ENGINEER);

// You can add more role-specific utilities here if needed.
// For example, mapping roles to permissions (though simple role check is sufficient for this assignment).