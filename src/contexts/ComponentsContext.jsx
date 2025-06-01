// src/contexts/ComponentsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllComponents, saveComponents, generateUniqueId } from '../utils/localStorageUtils';
import { useNotifications } from './NotificationContext'; // Import useNotifications

const ComponentsContext = createContext(null);

export const ComponentsProvider = ({ children }) => {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addNotification } = useNotifications(); // Get addNotification from NotificationContext

  useEffect(() => {
    const loadComponents = async () => {
      try {
        setLoading(true);
        const storedComponents = await getAllComponents();
        setComponents(storedComponents);
      } catch (err) {
        console.error("Failed to load components:", err);
        setError("Failed to load components.");
        addNotification("Failed to load components.", 'error'); // Notify on load error
      } finally {
        setLoading(false);
      }
    };
    loadComponents();
  }, []);

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
      addNotification(`Component "${newComponent.name}" created successfully!`, 'success'); // Notify on success
      return newComponent;
    } catch (err) {
      console.error("Error adding component:", err);
      setError("Failed to add component.");
      addNotification(`Failed to add component: ${err.message}`, 'error'); // Notify on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComponent = async (updatedComponentData) => {
    try {
      setLoading(true);
      const updatedComponents = components.map(comp =>
        comp.id === updatedComponentData.id ? { ...updatedComponentData, updatedAt: new Date().toISOString() } : comp
      );
      await saveComponents(updatedComponents);
      setComponents(updatedComponents);
      addNotification(`Component "${updatedComponentData.name}" updated successfully!`, 'success'); // Notify on success
      return updatedComponentData;
    } catch (err) {
      console.error("Error updating component:", err);
      setError("Failed to update component.");
      addNotification(`Failed to update component: ${err.message}`, 'error'); // Notify on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteComponent = async (componentId) => {
    try {
      setLoading(true);
      const componentToDelete = components.find(comp => comp.id === componentId);
      const updatedComponents = components.filter(comp => comp.id !== componentId);
      await saveComponents(updatedComponents);
      setComponents(updatedComponents);
      addNotification(`Component "${componentToDelete?.name || 'N/A'}" deleted successfully!`, 'success'); // Notify on success
      return true;
    } catch (err) {
      console.error("Error deleting component:", err);
      setError("Failed to delete component.");
      addNotification(`Failed to delete component: ${err.message}`, 'error'); // Notify on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    components,
    loading,
    error,
    addComponent,
    updateComponent,
    deleteComponent,
    getComponentById: (id) => components.find(comp => comp.id === id),
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