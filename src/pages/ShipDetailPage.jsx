// src/pages/ShipDetailPage.jsx
// This page will show detailed information for a single ship. [cite: 8]
import React from 'react';
import { useParams } from 'react-router-dom';
// import { useShips } from '../contexts/ShipsContext';
// import { useComponents } from '../contexts/ComponentsContext';
// import { useJobs } from '../contexts/JobsContext';

function ShipDetailPage() {
  const { id } = useParams(); // Get ship ID from URL
  // const { getShipById, loadingShips } = useShips();
  // const { getComponentsByShipId, loadingComponents } = useComponents();
  // const { getJobsByShipId, loadingJobs } = useJobs();

  // const ship = getShipById(id);
  // const components = getComponentsByShipId(id);
  // const maintenanceHistory = getJobsByShipId(id);

  // if (loadingShips || loadingComponents || loadingJobs) {
  //   return <div>Loading ship details...</div>;
  // }

  // if (!ship) {
  //   return <div>Ship not found.</div>;
  // }

  return (
    <div className="ship-detail-page-container">
      <h1>Ship Profile: {id}</h1> {/* Display ship name here once loaded */}
      {/* <h2>General Information</h2> */}
      {/* Display ship.name, ship.imo, ship.flag, ship.status here [cite: 7] */}

      {/* <h2>Components Installed</h2> */}
      {/* <ComponentList components={components} /> [cite: 8] */}

      {/* <h2>Maintenance History</h2> */}
      {/* Display maintenanceHistory (jobs) here [cite: 8] */}
      <p>View a detailed Ship Profile page including General Information, Maintenance History, Components installed. [cite: 8]</p>
    </div>
  );
}

export default ShipDetailPage;