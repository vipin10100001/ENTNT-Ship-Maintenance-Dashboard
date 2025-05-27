// src/contexts/ComponentsContext.jsx
// This file will manage the state and operations for ship components.
// It will utilize localStorageUtils for data persistence.
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllComponents, saveComponents } from '../components/utils/localStorageUtils';

const ComponentsContext = createContext(null);

export const ComponentsProvider = ({ children }) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const storedComponents = await getAllComponents();
      setComponents(storedComponents);
      setLoading(false);
    };
    loadData();
  }, []);

  const addComponent = async (componentData) => {
    const newComponent = { id: `c${Date.now()}`, ...componentData }; // Generate unique ID
    const updatedComponents = [...components, newComponent];
    setComponents(updatedComponents);
    await saveComponents(updatedComponents); // Persist to storage
    return newComponent;
  };

  const editComponent = async (id, updatedData) => {
    const updatedComponents = components.map((component) =>
      component.id === id ? { ...component, ...updatedData } : component
    );
    setComponents(updatedComponents);
    await saveComponents(updatedComponents); // Persist to storage
    return updatedComponents.find(c => c.id === id);
  };

  const deleteComponent = async (id) => {
    const updatedComponents = components.filter((component) => component.id !== id);
    setComponents(updatedComponents);
    await saveComponents(updatedComponents); // Persist to storage
  };

  const getComponentsByShipId = (shipId) => {
    return components.filter(component => component.shipId === shipId);
  };

  const getComponentById = (id) => {
    return components.find(component => component.id === id);
  };

  const value = {
    components,
    addComponent,
    editComponent,
    deleteComponent,
    getComponentsByShipId,
    getComponentById,
    loadingComponents: loading,
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