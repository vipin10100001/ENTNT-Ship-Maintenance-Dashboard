// src/components/Jobs/JobList.jsx
// Displays a list of maintenance jobs with filtering options. [cite: 11]
import React from 'react';

function JobList({ jobs, onUpdateStatus, onEdit, onDelete }) {
  if (!jobs || jobs.length === 0) {
    return <p>No maintenance jobs found.</p>;
  }

  return (
    <div className="job-list-container">
      <h4>Maintenance Jobs</h4>
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Assigned To</th> {/* Will require fetching engineer name */}
            <th>Scheduled Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.id}>
              <td>{job.type}</td>
              <td>{job.priority}</td>
              <td>
                <select value={job.status} onChange={(e) => onUpdateStatus(job.id, e.target.value)}>
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </td>
              <td>{job.assignedEngineerId}</td> {/* Show actual name later */}
              <td>{job.scheduledDate}</td>
              <td>
                <button onClick={() => onEdit(job)}>Edit</button>
                <button onClick={() => onDelete(job.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default JobList;