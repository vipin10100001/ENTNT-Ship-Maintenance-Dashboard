// src/contexts/ShipsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
// Import necessary functions from localStorageUtils, including a new generateUniqueId
import { getAllShips, saveShips, generateUniqueId } from '@/utils/localStorageUtils'; // Assuming generateUniqueId is added

const ShipsContext = createContext(null);

export const ShipsProvider = ({ children }) => {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load ships on initial mount
  useEffect(() => {
    const loadShips = async () => {
      try {
        setLoading(true);
        const storedShips = await getAllShips();
        setShips(storedShips);
      } catch (err) {
        console.error("Failed to load ships:", err);
        setError("Failed to load ships.");
      } finally {
        setLoading(false);
      }
    };
    loadShips();
  }, []);

  // Function to add a new ship
  const addShip = async (newShipData) => {
    try {
      setLoading(true);
      const newShip = {
        id: generateUniqueId('s'), // Generate a unique ID, e.g., 's12345'
        ...newShipData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedShips = [...ships, newShip];
      await saveShips(updatedShips); // Save to local storage
      setShips(updatedShips); // Update state
      return newShip;
    } catch (err) {
      console.error("Error adding ship:", err);
      setError("Failed to add ship.");
      throw err; // Re-throw to be caught by component
    } finally {
      setLoading(false);
    }
  };

  // Function to update an existing ship
  const updateShip = async (updatedShipData) => {
    try {
      setLoading(true);
      const updatedShips = ships.map(ship =>
        ship.id === updatedShipData.id ? { ...updatedShipData, updatedAt: new Date().toISOString() } : ship
      );
      await saveShips(updatedShips);
      setShips(updatedShips);
      return updatedShipData;
    } catch (err) {
      console.error("Error updating ship:", err);
      setError("Failed to update ship.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a ship (optional, but good to add now)
  const deleteShip = async (shipId) => {
    try {
      setLoading(true);
      const updatedShips = ships.filter(ship => ship.id !== shipId);
      await saveShips(updatedShips);
      setShips(updatedShips);
      return true;
    } catch (err) {
      console.error("Error deleting ship:", err);
      setError("Failed to delete ship.");
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const value = {
    ships,
    loading,
    error,
    addShip,   // Expose addShip
    updateShip, // Expose updateShip
    deleteShip, // Expose deleteShip
    getShipById: (id) => ships.find(ship => ship.id === id), // Helper to get a single ship
  };

  return <ShipsContext.Provider value={value}>{children}</ShipsContext.Provider>;
};

export const useShips = () => {
  const context = useContext(ShipsContext);
  if (context === undefined) {
    throw new Error('useShips must be used within a ShipsProvider');
  }
  return context;
};