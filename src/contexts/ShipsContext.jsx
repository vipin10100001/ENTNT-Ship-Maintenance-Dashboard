// src/contexts/ShipsContext.jsx
// This file will manage the state and operations for ships.
// It will utilize localStorageUtils for data persistence.
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllShips, saveShips } from '@/utils/localStorageUtils'

const ShipsContext = createContext(null);

export const ShipsProvider = ({ children }) => {
  const [ships, setShips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const storedShips = await getAllShips();
      setShips(storedShips);
      setLoading(false);
    };
    loadData();
  }, []);

  const addShip = async (shipData) => {
    const newShip = { id: `s${Date.now()}`, ...shipData }; // Generate unique ID
    const updatedShips = [...ships, newShip];
    setShips(updatedShips);
    await saveShips(updatedShips); // Persist to storage
    return newShip;
  };

  const editShip = async (id, updatedData) => {
    const updatedShips = ships.map((ship) =>
      ship.id === id ? { ...ship, ...updatedData } : ship
    );
    setShips(updatedShips);
    await saveShips(updatedShips); // Persist to storage
    return updatedShips.find(ship => ship.id === id);
  };

  const deleteShip = async (id) => {
    const updatedShips = ships.filter((ship) => ship.id !== id);
    setShips(updatedShips);
    await saveShips(updatedShips); // Persist to storage
  };

  const getShipById = (id) => {
    return ships.find(ship => ship.id === id);
  };

  const value = {
    ships,
    addShip,
    editShip,
    deleteShip,
    getShipById,
    loadingShips: loading,
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