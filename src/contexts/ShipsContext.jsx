// src/contexts/ShipsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllShips, saveShips, generateUniqueId } from '@/utils/localStorageUtils';
import { useNotifications } from './NotificationContext'; // Import useNotifications

const ShipsContext = createContext(null);

export const ShipsProvider = ({ children }) => {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addNotification } = useNotifications(); // Get addNotification from NotificationContext

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
        addNotification("Failed to load ships.", 'error'); // Notify on load error
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
        id: generateUniqueId('s'),
        ...newShipData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedShips = [...ships, newShip];
      await saveShips(updatedShips);
      setShips(updatedShips);
      addNotification(`Ship "${newShip.name}" created successfully!`, 'success'); // Notify on success
      return newShip;
    } catch (err) {
      console.error("Error adding ship:", err);
      setError("Failed to add ship.");
      addNotification(`Failed to add ship: ${err.message}`, 'error'); // Notify on error
      throw err;
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
      addNotification(`Ship "${updatedShipData.name}" updated successfully!`, 'success'); // Notify on success
      return updatedShipData;
    } catch (err) {
      console.error("Error updating ship:", err);
      setError("Failed to update ship.");
      addNotification(`Failed to update ship: ${err.message}`, 'error'); // Notify on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a ship
  const deleteShip = async (shipId) => {
    try {
      setLoading(true);
      const shipToDelete = ships.find(ship => ship.id === shipId);
      const updatedShips = ships.filter(ship => ship.id !== shipId);
      await saveShips(updatedShips);
      setShips(updatedShips);
      addNotification(`Ship "${shipToDelete?.name || 'N/A'}" deleted successfully!`, 'success'); // Notify on success
      return true;
    } catch (err) {
      console.error("Error deleting ship:", err);
      setError("Failed to delete ship.");
      addNotification(`Failed to delete ship: ${err.message}`, 'error'); // Notify on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    ships,
    loading,
    error,
    addShip,
    updateShip,
    deleteShip,
    getShipById: (id) => ships.find(ship => ship.id === id),
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