// src/components/Jobs/JobForm.jsx
import React, { useState, useEffect } from 'react';
import { useJobs } from '@/contexts/JobsContext';      // To use addJob/updateJob functions
import { useShips } from '@/contexts/ShipsContext';    // To get list of ships
import { useComponents } from '@/contexts/ComponentsContext'; // To get list of components
import { useAuth } from '@/contexts/AuthContext';      // To get list of engineers (users with 'Engineer' role)

function JobForm({ jobToEdit, onClose }) { // jobToEdit for edit mode, onClose to close the form
  const [shipId, setShipId] = useState('');
  const [componentId, setComponentId] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('Medium'); // Default priority
  const [status, setStatus] = useState('Open');       // Default status
  const [assignedEngineerId, setAssignedEngineerId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [description, setDescription] = useState(''); // Added description field
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { addJob, updateJob } = useJobs();
  const { ships, loading: loadingShips } = useShips(); // Get all ships
  const { components, loading: loadingComponents } = useComponents(); // Get all components
  const { users: allUsers, loading: loadingUsers } = useAuth(); // Get all users from AuthContext

  const engineers = allUsers.filter(user => user.role === 'Engineer'); // Filter for engineers

  // Populate form if in edit mode
  useEffect(() => {
    if (jobToEdit) {
      setShipId(jobToEdit.shipId || '');
      setComponentId(jobToEdit.componentId || '');
      setType(jobToEdit.type || '');
      setPriority(jobToEdit.priority || 'Medium');
      setStatus(jobToEdit.status || 'Open');
      setAssignedEngineerId(jobToEdit.assignedEngineerId || '');
      // Format date for input[type="date"]
      setScheduledDate(jobToEdit.scheduledDate ? new Date(jobToEdit.scheduledDate).toISOString().split('T')[0] : '');
      setDescription(jobToEdit.description || '');
    }
  }, [jobToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Basic validation
    if (!shipId || !componentId || !type || !priority || !status || !assignedEngineerId || !scheduledDate || !description) {
      setError('All fields are required.');
      setLoading(false);
      return;
    }

    const jobData = {
      shipId,
      componentId,
      type,
      priority,
      status,
      assignedEngineerId,
      scheduledDate,
      description,
    };

    try {
      if (jobToEdit) {
        // Edit existing job
        await updateJob({ ...jobToEdit, ...jobData });
        console.log('Job updated successfully:', jobToEdit.id);
      } else {
        // Add new job
        await addJob(jobData);
        console.log('New job added successfully.');
      }
      onClose(); // Close the form on success
      // You might want to navigate to /jobs or update the list automatically
    } catch (err) {
      console.error('Error saving job:', err);
      setError(err.message || 'Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loadingShips || loadingComponents || loadingUsers) {
    return <div className="loading-fullscreen">Loading form data...</div>;
  }

  return (
    <div className="job-form-container card">
      <h2>{jobToEdit ? 'Edit Job' : 'Create New Job'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="shipId">Ship</label>
          <select
            id="shipId"
            value={shipId}
            onChange={(e) => {
              setShipId(e.target.value);
              setComponentId(''); // Reset component when ship changes
            }}
            required
            disabled={loading}
          >
            <option value="">Select a Ship</option>
            {ships.map(ship => (
              <option key={ship.id} value={ship.id}>{ship.name}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="componentId">Component</label>
          <select
            id="componentId"
            value={componentId}
            onChange={(e) => setComponentId(e.target.value)}
            required
            disabled={loading || !shipId} // Disable if no ship is selected
          >
            <option value="">Select a Component</option>
            {shipId && components.filter(comp => comp.shipId === shipId).map(comp => (
              <option key={comp.id} value={comp.id}>{comp.name} ({comp.serialNumber})</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="type">Job Type</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Select Type</option>
            <option value="Inspection">Inspection</option>
            <option value="Repair">Repair</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Overhaul">Overhaul</option>
            <option value="Installation">Installation</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
            disabled={loading}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            disabled={loading}
          >
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="assignedEngineerId">Assigned Engineer</label>
          <select
            id="assignedEngineerId"
            value={assignedEngineerId}
            onChange={(e) => setAssignedEngineerId(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Select Engineer</option>
            {engineers.map(engineer => (
              // Corrected JSX structure to avoid "Unexpected token" error
              <option key={engineer.id} value={engineer.id}>
                {engineer.email} {/* Display email or username */}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="scheduledDate">Scheduled Date</label>
          <input
            type="date"
            id="scheduledDate"
            value={scheduledDate}
            onChange={(e) => setScheduledDate(e.target.value)}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            placeholder="Brief description of the job..."
            required
            disabled={loading}
          ></textarea>
        </div>

        {error && <p className="error-message">{error}</p>}

        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? (jobToEdit ? 'Saving...' : 'Creating...') : (jobToEdit ? 'Update Job' : 'Create Job')}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default JobForm;