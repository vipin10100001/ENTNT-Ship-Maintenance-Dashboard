// src/pages/ShipDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import TimeAgo from '@/components/TimeAgo';

// Import API functions
import { getShipDetails, getComponentsByShipId } from '@/api/shipApi'; // getShipDetails, getComponentsByShipId
import { addComponent, updateComponent, deleteComponent } from '@/api/componentApi'; // ADDED: Imports for component CRUD API
import { deleteJob } from '@/api/jobApi';  
import { getAllJobs } from '@/utils/localStorageUtils'; // USED to filter jobs as ShipDetailPage doesn't use JobsContext

// Import your ComponentForm and JobForm directly
import ComponentForm from '@/components/Components/ComponentForm';
import JobForm from '@/components/Jobs/JobForm';

function ShipDetailPage() {
  const { id: shipId } = useParams(); // Destructure as shipId
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const { hasRole, users: allUsers, loading: loadingAuth, error: errorAuth } = useAuth(); // Destructure allUsers for getEngineerEmail

  // State for ship data, components, jobs, loading, errors, and form visibility
  const [ship, setShip] = useState(null);
  const [components, setComponents] = useState([]);
  const [jobs, setJobs] = useState([]); // State for jobs on this ship
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showComponentForm, setShowComponentForm] = useState(false);
  const [componentToEdit, setComponentToEdit] = useState(null);

  const [showJobForm, setShowJobForm] = useState(false);
  const [jobToEdit, setJobToEdit] = useState(null);

  // --- Data Fetching Effect ---
  useEffect(() => {
    const fetchShipAndRelatedData = async () => {
      if (!shipId) {
        setError("No ship ID provided.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const foundShip = await getShipDetails(shipId);
        if (!foundShip) {
          setError("Ship not found.");
          addNotification("Ship not found for the given ID.", 'error');
          setLoading(false);
          return;
        }
        setShip(foundShip);

        const fetchedComponents = await getComponentsByShipId(shipId);
        setComponents(fetchedComponents || []);

        // Fetch all jobs, then filter by shipId
        const allJobs = await getAllJobs(); // Get all jobs from localStorageUtils
        const shipJobs = allJobs.filter(job => job.shipId === shipId)
                                .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
        setJobs(shipJobs);

      } catch (err) {
        console.error("Failed to fetch ship details or components:", err);
        setError("Failed to load ship details or components. Please try again.");
        addNotification("Failed to load ship details or components.", 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchShipAndRelatedData();
  }, [shipId, addNotification]); // Depend on shipId and addNotification


  // --- Handlers for Component Form ---
  const handleAddComponentClick = () => {
    setComponentToEdit(null); // Clear any editing state for new form
    setShowComponentForm(true);
  };

  const handleEditComponent = (comp) => {
    setComponentToEdit(comp);
    setShowComponentForm(true);
  };

  const handleCloseComponentForm = () => {
    setShowComponentForm(false);
    setComponentToEdit(null);
    // After closing, re-fetch components to reflect any changes made in the form
    // (This is important since ComponentForm itself modifies data via contexts/API calls directly)
    fetchComponentsForShip(); // Call a helper to re-fetch components
  };

  const fetchComponentsForShip = async () => {
      try {
          const updatedComponents = await getComponentsByShipId(shipId);
          setComponents(updatedComponents || []);
      } catch (err) {
          console.error("Error re-fetching components:", err);
          addNotification("Failed to refresh component list.", 'error');
      }
  };


  const handleDeleteComponent = async (componentId, componentName, associatedShipId) => { // Added associatedShipId param
    if (window.confirm(`Are you sure you want to delete component "${componentName}" from this ship?`)) {
      try {
        await deleteComponent(componentId);
        addNotification(`Component "${componentName}" deleted successfully!`, 'success');
        // Re-fetch components to update the list on the page
        const updatedComponents = await getComponentsByShipId(associatedShipId); // Use associatedShipId
        setComponents(updatedComponents);
      } catch (err) {
        console.error("Failed to delete component:", err);
        addNotification(`Failed to delete component "${componentName}". Error: ${err.message}`, 'error');
      }
    }
  };


  // --- Handlers for Job Form ---
  const handleEditJob = (job) => {
    setJobToEdit(job);
    setShowJobForm(true);
  };

  const handleCloseJobForm = () => {
    setShowJobForm(false);
    setJobToEdit(null);
    // After closing, re-fetch jobs to reflect any changes made in the form
    fetchJobsForShip(); // Call a helper to re-fetch jobs
  };

  const fetchJobsForShip = async () => {
      try {
          const allJobs = await getAllJobs();
          const shipJobs = allJobs.filter(job => job.shipId === shipId)
                                  .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
          setJobs(shipJobs);
      } catch (err) {
          console.error("Error re-fetching jobs:", err);
          addNotification("Failed to refresh job list.", 'error');
      }
  };


  const handleDeleteJob = async (jobId, jobDescription, associatedShipId, componentId) => { // Added associatedShipId, componentId params
    const componentName = components.find(c => c.id === componentId)?.name || 'N/A';
    if (window.confirm(`Are you sure you want to delete job "${jobDescription}" for component "${componentName}"? This action cannot be undone.`)) {
      try {
        await deleteJob(jobId);
        addNotification(`Job "${jobDescription}" deleted successfully!`, 'success');
        // Re-fetch jobs to update the list on the page
        const allJobs = await getAllJobs();
        const shipJobs = allJobs.filter(job => job.shipId === associatedShipId)
                                .sort((a, b) => new Date(b.scheduledDate) - new Date(a.scheduledDate));
        setJobs(shipJobs);
      } catch (err) {
        console.error("Failed to delete job:", err);
        addNotification(`Failed to delete job "${jobDescription}". Error: ${err.message}`, 'error');
      }
    }
  };

  // Helper to get Engineer Email for Job History
  const getEngineerEmail = (engineerId) => {
    const engineer = allUsers.find(u => u.id === engineerId && u.role === 'Engineer');
    return engineer ? engineer.email : 'Unassigned';
  };

  // --- Render Logic ---
  if (loading || loadingAuth) { // Include loadingAuth here
    return <div className="loading-fullscreen">Loading ship profile...</div>;
  }

  if (error || errorAuth) { // Include errorAuth here
    return <div className="error-message fullscreen">Error loading ship profile: {error || errorAuth}</div>;
  }

  if (!ship) {
    return <div className="error-message fullscreen">Ship not found. Please check the URL.</div>;
  }

  return (
    <div className="ship-detail-page">
      <div className="main-content-header">
        <h1>Ship Profile: {ship.name}</h1>
        <button onClick={() => navigate('/ships')} className="btn-secondary">Back to Ships</button>
      </div>

      {/* Conditional Forms with Overlay */}
      {/* ComponentForm uses its own internal state and context actions.
          It calls onClose, which then triggers a re-fetch of components for this page. */}
      {showComponentForm && (
        <div className="form-overlay">
          <ComponentForm
            componentToEdit={componentToEdit}
            onClose={handleCloseComponentForm} // This will trigger the re-fetch
            shipId={shipId} // Pass current shipId to pre-fill in form
          />
        </div>
      )}
      {showJobForm && (
        <div className="form-overlay">
          <JobForm
            jobToEdit={jobToEdit}
            onClose={handleCloseJobForm} // This will trigger the re-fetch
          />
        </div>
      )}

      {/* Main Content Sections - Only show if no forms are open */}
      {!showComponentForm && !showJobForm && (
        <>
          <div className="card general-info-section">
            <h2>General Information</h2>
            <p><strong>Name:</strong> {ship.name}</p>
            <p><strong>IMO Number:</strong> {ship.imo}</p>
            <p><strong>Flag:</strong> {ship.flag}</p>
            <p><strong>Status:</strong> {ship.status}</p>
             {/* Add more ship details like type, builtYear, owner if your ship data has them */}
            {ship.type && <p><strong>Type:</strong> {ship.type}</p>}
            {ship.builtYear && <p><strong>Built Year:</strong> {ship.builtYear}</p>}
            {ship.owner && <p><strong>Owner:</strong> {ship.owner}</p>}
          </div>

          {/* Components Installed Section */}
          <div className="card components-installed-section">
            <div className="card-header-with-button">
              <h2>Components Installed</h2>
              {hasRole(['Admin', 'Engineer']) && ( // Only Admins and Engineers can add components
                <button onClick={handleAddComponentClick}>Add New Component</button>
              )}
            </div>
            {components.length > 0 ? (
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
                    {components.map(comp => (
                      <tr key={comp.id}>
                        <td>{comp.name}</td>
                        <td>{comp.serialNumber}</td>
                        <td>{new Date(comp.installDate).toLocaleDateString()}</td>
                        <td>{comp.lastMaintenanceDate ? new Date(comp.lastMaintenanceDate).toLocaleDateString() : 'N/A'}</td>
                        <td>
                          {hasRole(['Admin', 'Engineer']) && (
                            <>
                              <button onClick={() => handleEditComponent(comp)} className="btn-secondary" style={{ marginRight: '10px' }}>Edit</button>
                              <button onClick={() => handleDeleteComponent(comp.id, comp.name, shipId)} className="btn-danger">Delete</button>
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
            {jobs.length > 0 ? ( // Use the 'jobs' state for this component
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
                    {jobs.map(job => (
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
                              <button onClick={() => handleDeleteJob(job.id, job.description, shipId, job.componentId)} className="btn-danger">Delete</button>
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