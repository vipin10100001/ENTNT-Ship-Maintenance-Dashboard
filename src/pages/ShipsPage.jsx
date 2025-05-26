// src/pages/ShipsPage.jsx
// This page will display a list of ships and allow CRUD operations. [cite: 7]
import React from 'react';
// import ShipList from '../components/Ships/ShipList';
// import ShipForm from '../components/Ships/ShipForm';

function ShipsPage() {
  return (
    <div className="ships-page-container">
      <h1>Ships Management</h1>
      {/* <ShipForm /> // For creating new ships */}
      {/* <ShipList /> */}
      <p>List Ships (fields: Name, IMO Number, Flag, Status). Create, Edit, and Delete Ships. [cite: 7]</p>
    </div>
  );
}

export default ShipsPage;