// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/main.css';
import { initializeMockData } from './utils/localStorageUtils.js';

// Call initializeMockData
initializeMockData();


console.log("main.jsx: Attempting to create root and render App into DOM.");


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);