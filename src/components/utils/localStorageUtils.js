// src/utils/localStorageUtils.js

import localforage from 'localforage'; // Using localforage for more robust storage solution than direct localStorage

const LOCAL_STORAGE_PREFIX = 'entnt_ship_dashboard_'; // Prefix to avoid conflicts in local storage

// --- Mock Data as provided in the PDF ---
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
    { id: 'c1', shipId: 's1', name: 'Main Engine', serialNumber: 'ME-1234', installDate: '2020-01-10', lastMaintenanceDate: '2024-03-12'},
    { id: 'c2', shipId: 's2', name: 'Radar', serialNumber: 'RAD-5678', installDate: '2021-07-18', lastMaintenanceDate: '2023-12-01'}
  ],
  jobs: [
    { id: 'j1', componentId: 'c1', shipId: 's1', type: 'Inspection', priority: 'High', status: 'Open', assignedEngineerld: '3', scheduledDate: '2025-05-05'}
  ]
};
// --- End Mock Data ---

/**
 * Initializes local storage with mock data if it's not already present.
 * This ensures the application has initial data on first load.
 */
export const initializeMockData = async () => {
  try {
    // Check and set users
    const users = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}users`);
    if (!users) {
      await localforage.setItem(`${LOCAL_STORAGE_PREFIX}users`, MOCK_DATA.users);
      console.log('Mock users initialized.');
    }

    // Check and set ships
    const ships = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}ships`);
    if (!ships) {
      await localforage.setItem(`${LOCAL_STORAGE_PREFIX}ships`, MOCK_DATA.ships);
      console.log('Mock ships initialized.');
    }

    // Check and set components
    const components = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}components`);
    if (!components) {
      await localforage.setItem(`${LOCAL_STORAGE_PREFIX}components`, MOCK_DATA.components);
      console.log('Mock components initialized.');
    }

    // Check and set jobs
    const jobs = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}jobs`);
    if (!jobs) {
      await localforage.setItem(`${LOCAL_STORAGE_PREFIX}jobs`, MOCK_DATA.jobs);
      console.log('Mock jobs initialized.');
    }
  } catch (err) {
    console.error('Error initializing mock data:', err);
  }
};

/**
 * User session management functions
 */
export const saveCurrentUser = async (user) => {
  await localforage.setItem(`${LOCAL_STORAGE_PREFIX}currentUser`, user);
};

export const loadCurrentUser = async () => {
  return await localforage.getItem(`${LOCAL_STORAGE_PREFIX}currentUser`);
};

export const removeCurrentUser = async () => {
  await localforage.removeItem(`${LOCAL_STORAGE_PREFIX}currentUser`);
};

/**
 * Data retrieval functions for mock data
 */
export const getAllUsers = async () => {
  const users = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}users`);
  return users || [];
};

export const getAllShips = async () => {
  const ships = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}ships`);
  return ships || [];
};

export const getAllComponents = async () => {
  const components = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}components`);
  return components || [];
};

export const getAllJobs = async () => {
  const jobs = await localforage.getItem(`${LOCAL_STORAGE_PREFIX}jobs`);
  return jobs || [];
};


// --- Placeholder functions for future CRUD operations (will be implemented as features are built) ---

/**
 * Ships Management functions
 */
export const saveShips = async (ships) => {
  await localforage.setItem(`${LOCAL_STORAGE_PREFIX}ships`, ships);
};
// Example of how specific ship operations would look (implementation details will be in context)
// export const addShipData = async (ship) => {
//   const currentShips = await getAllShips();
//   await saveShips([...currentShips, { ...ship, id: `s${Date.now()}` }]);
// };
// export const updateShipData = async (updatedShip) => {
//   const currentShips = await getAllShips();
//   await saveShips(currentShips.map(s => s.id === updatedShip.id ? updatedShip : s));
// };
// export const deleteShipData = async (shipId) => {
//   const currentShips = await getAllShips();
//   await saveShips(currentShips.filter(s => s.id !== shipId));
// };

/**
 * Components Management functions
 */
export const saveComponents = async (components) => {
  await localforage.setItem(`${LOCAL_STORAGE_PREFIX}components`, components);
};
// export const addComponentData = async (component) => { ... };
// export const updateComponentData = async (updatedComponent) => { ... };
// export const deleteComponentData = async (componentId) => { ... };


/**
 * Jobs Management functions
 */
export const saveJobs = async (jobs) => {
  await localforage.setItem(`${LOCAL_STORAGE_PREFIX}jobs`, jobs);
};
// export const addJobData = async (job) => { ... };
// export const updateJobData = async (updatedJob) => { ... };
// export const deleteJobData = async (jobId) => { ... };

/**
 * Utility to clear all stored data (useful for development/testing)
 */
export const clearAllData = async () => {
    await localforage.clear();
    console.log('All localforage data cleared!');
    // Re-initialize mock data after clearing if you want to start fresh
    await initializeMockData();
};