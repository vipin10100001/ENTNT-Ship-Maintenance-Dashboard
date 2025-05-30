// src/utils/localStorageUtils.js

import localforage from 'localforage'; // Make sure localforage is installed: npm install localforage

const LOCAL_STORAGE_PREFIX = 'entnt_ship_dashboard_';

const MOCK_DATA = {
  users: [
    { id: '1', role: 'Admin', email: 'admin@entnt.in', password: 'admin123' },
    { id: '2', role: 'Inspector', email: 'inspector@entnt.in', password: 'inspect123' },
    { id: '3', role: 'Engineer', email: 'engineer@entnt.in', password: 'engine123'}
  ],
  ships: [
    { id: 's1', name: 'Ever Given', imo: '9811000', flag: 'Panama', status: 'Active' },
    { id: 's2', name: 'Maersk Alabama', imo: '9164263', flag: 'USA', status: 'Under Maintenance' }
  ],
  components: [
    { id: 'c1', shipId: 's1', name: "Main Engine", serialNumber: "ME-1234", installDate: "2020-01-10", lastMaintenanceDate: "2024-03-12"},
    { id: 'c2', shipId: 's2', name: "Radar", serialNumber: "RAD-5678", installDate: "2021-07-18", lastMaintenanceDate: "2023-12-01"}
  ],
  jobs: [
    { id: 'j1', componentId: 'c1', shipId: 's1', type: "Inspection", priority: "High", status: "Open", assignedEngineerId: "3", scheduledDate: "2025-05-05"}
  ]
};

// Helper function to generate a unique ID
export const generateUniqueId = (prefix = '') => {
  return `${prefix}${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};


export const initializeMockData = async () => {
  try {
    const users = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}users`);
    if (!users || users.length === 0) { // Check if users are initialized or empty
      await localforage.setItem(`${LOCAL_STORAGE_PREFIX}users`, MOCK_DATA.users);
      console.log('Mock users initialized.');
    }

    const ships = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}ships`);
    if (!ships || ships.length === 0) { // Check if ships are initialized or empty
      await localforage.setItem(`${LOCAL_STORAGE_PREFIX}ships`, MOCK_DATA.ships);
      console.log('Mock ships initialized.');
    }

    const components = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}components`);
    if (!components || components.length === 0) { // Check if components are initialized or empty
      await localforage.setItem(`${LOCAL_STORAGE_PREFIX}components`, MOCK_DATA.components);
      console.log('Mock components initialized.');
    }

    const jobs = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}jobs`);
    if (!jobs || jobs.length === 0) { // Check if jobs are initialized or empty
      await localforage.setItem(`${LOCAL_STORAGE_PREFIX}jobs`, MOCK_DATA.jobs);
      console.log('Mock jobs initialized.');
    }
  } catch (err) {
    console.error('Error initializing mock data:', err);
  }
};

// --- User Session Management (current logged-in user) ---
export const saveCurrentUser = async (user) => {
  await localforage.setItem(`${LOCAL_STORAGE_PREFIX}currentUser`, user);
};

export const loadCurrentUser = async () => {
  return await localforage.getItem(`${LOCAL_STORAGE_PREFIX}currentUser`);
};

export const removeCurrentUser = async () => {
  await localforage.removeItem(`${LOCAL_STORAGE_PREFIX}currentUser`);
};

// --- User Data Management (all users in the system) ---
export const getAllUsers = async () => {
  const users = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}users`);
  return users || [];
};

// This function is for finding a user by email from the *list* of all users
export const getUserByEmail = async (email) => {
  const users = await getAllUsers();
  return users.find(user => user.email === email);
};

// This function (if needed) for saving a user to the *list* of all users
// export const saveUser = async (user) => {
//   const users = await getAllUsers();
//   const updatedUsers = users.map(u => u.id === user.id ? user : u);
//   // If user is new, add them
//   if (!users.some(u => u.id === user.id)) {
//     updatedUsers.push(user);
//   }
//   await localforage.setItem(`${LOCAL_STORAGE_PREFIX}users`, updatedUsers);
// };

// This function (if needed) for removing a user from the *list* of all users
// export const removeUser = async (id) => {
//   const users = await getAllUsers();
//   const updatedUsers = users.filter(u => u.id !== id);
//   await localforage.setItem(`${LOCAL_STORAGE_PREFIX}users`, updatedUsers);
// };


// --- Ship Data Management ---
export const getAllShips = async () => {
  const ships = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}ships`);
  return ships || [];
};

export const saveShips = async (ships) => {
  await localforage.setItem(`${LOCAL_STORAGE_PREFIX}ships`, ships);
};

// --- Component Data Management ---
export const getAllComponents = async () => {
  const components = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}components`);
  return components || [];
};

export const saveComponents = async (components) => {
  await localforage.setItem(`${LOCAL_STORAGE_PREFIX}components`, components);
};

// --- Job Data Management ---
export const getAllJobs = async () => {
  const jobs = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}jobs`);
  return jobs || [];
};

export const saveJobs = async (jobs) => {
  await localforage.setItem(`${LOCAL_STORAGE_PREFIX}jobs`, jobs);
};

// --- Utility for clearing all data ---
export const clearAllData = async () => {
    await localforage.clear();
    console.log('All localforage data cleared!');
    // Re-initialize mock data after clearing, so app has something to work with
    await initializeMockData();
};