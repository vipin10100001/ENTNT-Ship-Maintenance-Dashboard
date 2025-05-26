// src/components/Jobs/JobForm.jsx
// Form for creating maintenance jobs. [cite: 11]
import React, { useState } from 'react';
// import { useJobs } from '../../contexts/JobsContext';
// import { useComponents } from '../../contexts/ComponentsContext'; // To select component

function JobForm({ jobToEdit, onSubmit }) {
  const [componentId, setComponentId] = useState(jobToEdit?.componentId || '');
  const [jobType, setJobType] = useState(jobToEdit?.type || '');
  const [priority, setPriority] = useState(jobToEdit?.priority || '');
  const [status, setStatus] = useState(jobToEdit?.status || 'Open');
  const [assignedEngineerId, setAssignedEngineerId] = useState(jobToEdit?.assignedEngineerId || '');
  const [scheduledDate, setScheduledDate] = useState(jobToEdit?.scheduledDate || '');
  const [error, setError] = useState('');

  // const { components } = useComponents(); // For dropdown of components
  // const { users } = useAuth(); // Assuming engineers can be fetched here

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!componentId || !jobType || !priority || !status || !assignedEngineerId || !scheduledDate) {
      setError('All fields are required.');
      return;
    }
    setError('');
    onSubmit({ componentId, type: jobType, priority, status, assignedEngineerId, scheduledDate });
  };

  return (
    <div className="job-form-container">
      <h3>{jobToEdit ? 'Edit Job' : 'Create New Job'}</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Component</label>
          <select value={componentId} onChange={(e) => setComponentId(e.target.value)} required>
            <option value="">Select a Component</option>
            {/* {components.map(comp => <option key={comp.id} value={comp.id}>{comp.name} ({comp.serialNumber})</option>)} */}
            <option value="c1">Main Engine (ME-1234)</option> {/* Dummy option */}
          </select>
        </div>
        <div className="form-group">
          <label>Job Type</label>
          <input type="text" value={jobType} onChange={(e) => setJobType(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} required>
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="form-group">
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} required>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="form-group">
          <label>Assigned Engineer</label>
          <select value={assignedEngineerId} onChange={(e) => setAssignedEngineerId(e.target.value)} required>
            <option value="">Select Engineer</option>
            {/* Filter users by 'Engineer' role */}
            {/* {users.filter(u => u.role === 'Engineer').map(eng => <option key={eng.id} value={eng.id}>{eng.email}</option>)} */}
            <option value="3">engineer@entnt.in</option> {/* Dummy option */}
          </select>
        </div>
        <div className="form-group">
          <label>Scheduled Date</label>
          <input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} required />
        </div>
        {error && <p className="error-message">{error}</p>}
        <button type="submit">{jobToEdit ? 'Save Changes' : 'Create Job'}</button>
      </form>
    </div>
  );
}

export default JobForm;