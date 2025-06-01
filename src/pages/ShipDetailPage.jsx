// src/pages/ShipDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShips } from '@/contexts/ShipsContext';
import { useComponents } from '@/contexts/ComponentsContext';
import { useJobs } from '@/contexts/JobsContext';
import { useAuth } from '@/contexts/AuthContext';       // For hasRole
import ComponentForm from '@/components/Components/ComponentForm';
import JobForm from '@/components/Jobs/JobForm';
import TimeAgo from '@/components/TimeAgo'; // Assuming you have this now. If not, uncomment and replace usage.


function ShipDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { ships, loading: loadingShips, error: errorShips, getShipById } = useShips();
  const { components, loading: loadingComponents, error: errorComponents, deleteComponent } = useComponents();
  const { jobs, loading: loadingJobs, error: errorJobs, deleteJob } = useJobs();
  // CORRECTED LINE BELOW: Destructure allUsers, loadingAuth, and errorAuth from useAuth
  const { hasRole, users: allUsers, loading: loadingAuth, error: errorAuth } = useAuth();

  const [showComponentForm, setShowComponentForm] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState(null);

  const [showJobForm, setShowJobForm] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  const ship = getShipById(id);
  const shipComponents = components.filter(comp => comp.shipId === id);
  const shipJobs = jobs.filter(job => job.shipId === id)
                        .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));

  // Handlers for Component Form
  const handleAddComponentClick = () => {
    setComponentToEdit(null);
    setShowComponentForm(true);
  };

  const handleEditComponent = (comp) => {
    setComponentToEdit(comp);
    setShowComponentForm(true);
  };

  const handleDeleteComponent = async (componentId, componentName, shipId) => {
    if (window.confirm(`Are you sure you want to delete component "${componentName}" from this ship?`)) {
      try {
        await deleteComponent(componentId);
        alert(`Component "${componentName}" deleted successfully!`);
      } catch (err) {
        alert(`Failed to delete component "${componentName}". Error: ${err.message}`);
      }
    }
  };

  const handleCloseComponentForm = () => {
    setShowComponentForm(false);
    setComponentToEdit(null);
  };

  // Handlers for Job Form
  const handleEditJob = (job) => {
    setJobToEdit(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId, jobDescription, shipId, componentId) => {
    const componentName = components.find(c => c.id === componentId)?.name || 'N/A';
    if (window.confirm(`Are you sure you want to delete job "${jobDescription}" for component "${componentName}"? This action cannot be undone.`)) {
      try {
        await deleteJob(jobId);
        alert(`Job "${jobDescription}" deleted successfully!`);
      } catch (err) {
        alert(`Failed to delete job "${jobDescription}". Error: ${err.message}`);
      }
    }
  };

  const handleCloseJobForm = () => {
    setShowJobForm(false);
    setJobToEdit(null);
  };

  // Helper to get Engineer Email for Job History
  const getEngineerEmail = (engineerId) => {
    const engineer = allUsers.find(u => u.id === engineerId && u.role === 'Engineer');
    return engineer ? engineer.email : 'Unassigned';
  };

  // CORRECTED: Include loadingAuth and errorAuth in checks
  if (loadingShips || loadingComponents || loadingJobs || loadingAuth) {
    return <div className="loading-fullscreen">Loading ship profile...</div>;
  }

  if (errorShips || errorComponents || errorJobs || errorAuth) {
    return <div className="error-message">Error loading ship profile: {errorShips || errorComponents || errorJobs || errorAuth}</div>;
  }

  if (!ship) {
    return <div className="error-message">Ship not found.</div>;
  }

  return (
    <div className="ship-detail-page">
      <div className="main-content-header">
        <h1>Ship Profile: {ship.name}</h1>
        <button onClick={() => navigate('/ships')} className="btn-secondary">Back to Ships</button>
      </div>

      {/* Conditional Forms */}
      {showComponentForm && (
        <ComponentForm
          componentToEdit={componentToEdit}
          onClose={handleCloseComponentForm}
          shipId={ship.id}
        />
      )}
      {showJobForm && (
        <JobForm
          jobToEdit={jobToEdit}
          onClose={handleCloseJobForm}
        />
      )}

      {/* General Information Section */}
      {!showComponentForm && !showJobForm && (
        <>
          <div className="card general-info-section">
            <h2>General Information</h2>
            <p><strong>Name:</strong> {ship.name}</p>
            <p><strong>IMO Number:</strong> {ship.imo}</p>
            <p><strong>Flag:</strong> {ship.flag}</p>
            <p><strong>Status:</strong> {ship.status}</p>
          </div>

          {/* Components Installed Section */}
          <div className="card components-installed-section">
            <div className="card-header-with-button">
              <h2>Components Installed</h2>
              {hasRole(['Admin', 'Engineer']) && (
                <button onClick={handleAddComponentClick}>Add New Component</button>
              )}
            </div>
            {shipComponents.length > 0 ? (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Serial Number</th>
                      <th>Installation Date</th>
                      <th>Last Maintenance Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipComponents.map(comp => (
                      <tr key={comp.id}>
                        <td>{comp.name}</td>
                        <td>{comp.serialNumber}</td>
                        <td>{comp.installDate}</td>
                        <td>{comp.lastMaintenanceDate}</td>
                        <td>
                          {hasRole(['Admin', 'Engineer']) && (
                            <>
                              <button onClick={() => handleEditComponent(comp)} className="btn-secondary" style={{ marginRight: '10px' }}>Edit</button>
                              <button onClick={() => handleDeleteComponent(comp.id, comp.name, comp.shipId)} className="btn-danger">Delete</button>
                            </>
                          )}
                          {!hasRole(['Admin', 'Engineer']) && (
                             <button className="btn-secondary">View</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No components installed on this ship. {hasRole(['Admin', 'Engineer']) && 'Click "Add New Component" to add one.'}</p>
            )}
          </div>

          {/* Maintenance History Section */}
          <div className="card maintenance-history-section">
            <h2>Maintenance History</h2>
            {shipJobs.length > 0 ? (
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Job ID</th>
                      <th>Type</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Scheduled Date</th>
                      <th>Assigned Engineer</th>
                      <th>Last Update</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shipJobs.map(job => (
                      <tr key={job.id}>
                        <td>{job.id.substring(0, 6)}...</td>
                        <td>{job.type}</td>
                        <td>{job.priority}</td>
                        <td>{job.status}</td>
                        <td>{job.scheduledDate}</td>
                        <td>{getEngineerEmail(job.assignedEngineerId)}</td>
                        <td><TimeAgo date={job.updatedAt || job.createdAt} /></td>
                        <td>
                          {hasRole(['Admin', 'Engineer']) && (
                            <>
                              <button onClick={() => handleEditJob(job)} className="btn-secondary">Edit</button>
                              <button onClick={() => handleDeleteJob(job.id, job.description, job.shipId, job.componentId)} className="btn-danger">Delete</button>
                            </>
                          )}
                          {!hasRole(['Admin', 'Engineer']) && (
                            <button className="btn-secondary">View</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No maintenance jobs recorded for this ship.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ShipDetailPage;