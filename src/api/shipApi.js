// src/api/shipApi.js

import { getAllShips, saveShips } from '../utils/localStorageUtils';

const SHIPS_KEY = 'ships'; // This key is implicitly used by getAllShips/saveShips internally

export const getShipDetails = async (shipId) => {
    const ships = await getAllShips(); // Use getAllShips
    return ships.find(ship => ship.id === shipId);
};

export const addShip = async (newShip) => {
    const ships = await getAllShips(); // Use getAllShips
    const updatedShips = [...ships, newShip]; // Assuming newShip already has an ID generated in context/form
    await saveShips(updatedShips); // Use saveShips
    return newShip; // Return the added ship for consistency
};

export const updateShip = async (updatedShip) => {
    const ships = await getAllShips(); // Use getAllShips
    const updatedShips = ships.map(ship =>
        ship.id === updatedShip.id ? updatedShip : ship
    );
    await saveShips(updatedShips); // Use saveShips
    return updatedShip;
};

export const deleteShip = async (shipId) => {
    const ships = await getAllShips(); // Use getAllShips
    const updatedShips = ships.filter(ship => ship.id !== shipId);
    await saveShips(updatedShips); // Use saveShips
    return true; // Indicate success
};


//  use the component's localStorageUtils functions
import { getAllComponents } from '../utils/localStorageUtils'; // Import specifically for components

export const getComponentsByShipId = async (shipId) => {
    const components = await getAllComponents(); // Use getAllComponents from localStorageUtils
    return components.filter(comp => comp.shipId === shipId);
};