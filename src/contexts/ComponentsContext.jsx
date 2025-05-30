// src/contexts/ComponentsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllComponents, saveComponents, generateUniqueId } from '../utils/localStorageUtils';
const ComponentsContext = createContext(null);

export const ComponentsProvider = ({ children }) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadComponents = async () => {
      try {
        setLoading(true);
        const storedComponents = await getAllComponents();
        setComponents(storedComponents);
      } catch (err) {
        console.error("Failed to load components:", err);
        setError("Failed to load components.");
      } finally {
        setLoading(false);
      }
    };
    loadComponents();
  }, []);

  // You will add addComponent, updateComponent, deleteComponent functions here later
  // Example for adding:
  const addComponent = async (newComponentData) => {
    try {
      setLoading(true);
      const newComponent = {
        id: generateUniqueId('c'),
        ...newComponentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedComponents = [...components, newComponent];
      await saveComponents(updatedComponents);
      setComponents(updatedComponents);
      return newComponent;
    } catch (err) {
      console.error("Error adding component:", err);
      setError("Failed to add component.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    components,
    loading,
    error,
    addComponent, // Expose addComponent for future use
    getComponentById: (id) => components.find(comp => comp.id === id),
    // You'll add updateComponent, deleteComponent, getComponentsByShipId etc. later
  };

  return <ComponentsContext.Provider value={value}>{children}</ComponentsContext.Provider>;
};

export const useComponents = () => {
  const context = useContext(ComponentsContext);
  if (context === undefined) {
    throw new Error('useComponents must be used within a ComponentsProvider');
  }
  return context;
};