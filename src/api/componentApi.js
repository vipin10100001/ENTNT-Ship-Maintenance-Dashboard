// src/api/componentApi.js
import { getAllComponents, saveComponents, generateUniqueId } from '../utils/localStorageUtils';

export const addComponent = async (newComponentData) => {
    const components = await getAllComponents();
    const newComponent = { ...newComponentData, id: generateUniqueId('c') }; // Generate ID here if not in form
    const updatedComponents = [...components, newComponent];
    await saveComponents(updatedComponents);
    return newComponent;
};

export const updateComponent = async (componentId, updatedData) => {
    const components = await getAllComponents();
    const updatedComponents = components.map(comp =>
        comp.id === componentId ? { ...comp, ...updatedData } : comp
    );
    await saveComponents(updatedComponents);
    return updatedData; // Return updated data
};

export const deleteComponent = async (componentId) => {
    const components = await getAllComponents();
    const updatedComponents = components.filter(comp => comp.id !== componentId);
    await saveComponents(updatedComponents);
    return true;
};