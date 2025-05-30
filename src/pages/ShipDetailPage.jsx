// src/pages/ShipDetailPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShips } from '@/contexts/ShipsContext';        // Use alias
import { useComponents } from '@/contexts/ComponentsContext'; // Use alias
import { useJobs } from '@/contexts/JobsContext';         // Use alias
import { useAuth } from '@/contexts/AuthContext'; // To check user roles

function ShipDetailPage() {
  const { id } = useParams(); // Get ship ID from URL
  const navigate = useNavigate();
  const { currentUser, hasRole } = useAuth(); // For role-based access to actions

  // Get data and loading states from contexts
  const { getShipById, loading: loadingShips, error: errorShips } = useShips();
  const { components, loading: loadingComponents, error: errorComponents } = useComponents();
  const { jobs, loading: loadingJobs, error: errorJobs } = useJobs();

  // Find the specific ship
  const ship = getShipById(id);

  // Filter components and jobs related to this ship
  const shipComponents = components.filter(component => component.shipId === id);
  const maintenanceHistory = jobs
    .filter(job => job.shipId === id)
    .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate)); // Sort by most recent job first

  // Handle loading states
  if (loadingShips || loadingComponents || loadingJobs) {
    return <div className="loading-fullscreen">Loading ship details...</div>;
  }

  // Handle errors
  if (errorShips || errorComponents || errorJobs) {
    return <div className="error-message">Error loading ship details: {errorShips || errorComponents || errorJobs}</div>;
  }

  // Handle ship not found
  if (!ship) {
    return <div className="error-message">Ship not found.</div>;
  }

  return (
    <div className="ship-detail-page"> {/* Changed container name for consistency */}
      <div className="main-content-header">
        <h1>Ship Profile: {ship.name}</h1>
        {hasRole(['Admin', 'Inspector']) && ( // Only Admins/Inspectors can add/edit components/jobs
          <div className="ship-actions">
            {/* You'll add buttons to add/edit components/jobs here later */}
            <button className="btn-secondary" onClick={() => navigate(`/ships`)}>Back to Ships</button>
          </div>
        )}
      </div>

      <div className="card">
        <h2>General Information</h2>
        <p><strong>Name:</strong> {ship.name}</p>
        <p><strong>IMO Number:</strong> {ship.imo}</p>
        <p><strong>Flag:</strong> {ship.flag}</p>
        <p><strong>Status:</strong> {ship.status}</p>
        {/* Add more general info fields if your ship mock data has them */}
      </div>

      <div className="card">
        <h2>Components Installed</h2>
        {shipComponents.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Serial Number</th>
                <th>Installation Date</th>
                <th>Last Maintenance</th>
                <th>Actions</th> {/* Placeholder for component actions */}
              </tr>
            </thead>
            <tbody>
              {shipComponents.map(component => (
                <tr key={component.id}>
                  <td>{component.name}</td>
                  <td>{component.serialNumber}</td>
                  <td>{component.installDate}</td>
                  <td>{component.lastMaintenanceDate || 'N/A'}</td> {/* Display raw date string or 'N/A' */}
                  <td>
                    {hasRole(['Admin', 'Inspector']) && (
                       <button className="btn-secondary" onClick={() => { /* Handle Edit Component */ alert('Edit Component not implemented yet!'); }}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No components installed on this ship.</p>
        )}
      </div>

      <div className="card">
        <h2>Maintenance History</h2>
        {maintenanceHistory.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Scheduled Date</th>
                <th>Assigned Engineer</th>
                <th>Actions</th> {/* Placeholder for job actions */}
              </tr>
            </thead>
            <tbody>
              {maintenanceHistory.map(job => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.type}</td>
                  <td>{job.priority}</td>
                  <td>{job.status}</td>
                  <td>{job.scheduledDate}</td>
                  {/* You'll need to fetch engineer's name from users based on job.assignedEngineerId */}
                  <td>{job.assignedEngineerId || 'N/A'}</td>
                  <td>
                    {hasRole(['Admin', 'Engineer']) && ( // Admins and Engineers can modify jobs
                        <button className="btn-secondary" onClick={() => { /* Handle Edit Job */ alert('Edit Job not implemented yet!'); }}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No maintenance history available for this ship.</p>
        )}
      </div>
    </div>
  );
}

export default ShipDetailPage;