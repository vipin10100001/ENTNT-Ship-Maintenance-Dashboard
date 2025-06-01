// src/api/authApi.js
import { getAllUsers, saveUsers, saveCurrentUser, loadCurrentUser, removeCurrentUser } from '../utils/localStorageUtils';

export const loginUser = async (email, password) => {
    const users = await getAllUsers();
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        await saveCurrentUser(user);
        return user;
    }
    throw new Error('Invalid credentials');
};

export const logoutUser = async () => {
    await removeCurrentUser();
};

export const getCurrentAuthUser = async () => {
    return await loadCurrentUser();
};

// Example if you need to register a new user
export const registerUser = async (userData) => {
    const users = await getAllUsers();
    // Basic check for existing email
    if (users.some(u => u.email === userData.email)) {
        throw new Error('User with this email already exists');
    }
    const newUser = { ...userData, id: generateUniqueId('u') }; // Assuming generateUniqueId is from localStorageUtils
    await saveUsers([...users, newUser]);
    return newUser;
};