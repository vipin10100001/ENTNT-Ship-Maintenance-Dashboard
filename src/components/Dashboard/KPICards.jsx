// src/components/Dashboard/KPICards.jsx
// This component will display key performance indicator cards. [cite: 15, 16]
import React from 'react';

function KPICards() {
  // Dummy data for now; will be calculated from contexts later
  const totalShips = 0;
  const overdueMaintenance = 0;
  const jobsInProgress = 0;
  const jobsCompleted = 0;

  return (
    <div className="kpi-cards-container">
      <div className="kpi-card">
        <h4>Total Ships</h4>
        <p>{totalShips}</p>
      </div>
      <div className="kpi-card">
        <h4>Overdue Maintenance</h4>
        <p>{overdueMaintenance}</p>
      </div>
      <div className="kpi-card">
        <h4>Jobs In Progress</h4>
        <p>{jobsInProgress}</p>
      </div>
      <div className="kpi-card">
        <h4>Jobs Completed</h4>
        <p>{jobsCompleted}</p>
      </div>
      <p>Use cards and basic charts for visual representation. [cite: 16]</p>
    </div>
  );
}

export default KPICards;