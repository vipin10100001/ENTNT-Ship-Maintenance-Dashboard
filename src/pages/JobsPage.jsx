// src/pages/JobsPage.jsx
import React, { useState } from 'react';
import { useJobs } from '@/contexts/JobsContext';
// import JobForm from '@/components/Jobs/JobForm'; // Uncomment when ready
// import JobList from '@/components/Jobs/JobList'; // Uncomment when ready

function JobsPage() {
  const { jobs, loadingJobs, addJob, updateJobStatus, editJob } = useJobs();
  const [filterShipId, setFilterShipId] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');

  // Dummy options for filters (will come from ShipsContext, etc. later)
  const mockShips = [{ id: 's1', name: 'Ever Given' }, { id: 's2', name: 'Maersk Alabama' }];
  const jobStatuses = ['Open', 'In Progress', 'Completed', 'Cancelled'];
  const jobPriorities = ['High', 'Medium', 'Low'];


  const filteredJobs = jobs.filter(job => {
    const matchesShip = filterShipId ? job.shipId === filterShipId : true;
    const matchesStatus = filterStatus ? job.status === filterStatus : true;
    const matchesPriority = filterPriority ? job.priority === filterPriority : true;
    return matchesShip && matchesStatus && matchesPriority;
  });

  const handleAddJob = (newJobData) => {
    addJob(newJobData);
    alert('Job created (simulated)!');
  };

  const handleUpdateJobStatus = (jobId, newStatus) => {
    updateJobStatus(jobId, newStatus);
    alert(`Job ${jobId} status updated to ${newStatus} (simulated)!`);
  };

  const handleEditJob = (job) => {
    alert(`Editing job: ${job.type}`);
    // In a real app, this would open a form/modal
  };

  const handleDeleteJob = (jobId) => {
    if (window.confirm('Are you sure you want to delete this job?')) {
      // Assuming you'd add a deleteJob function to JobsContext
      alert(`Job ${jobId} deleted (simulated)!`);
    }
  };


  if (loadingJobs) {
    return <div className="loading-state">Loading jobs...</div>;
  }

  return (
    <div className="jobs-page-container">
      <div className="main-content-header">
        <h1>Maintenance Jobs</h1>
        <button onClick={() => alert('Open create job form')}>Create New Job</button>
      </div>

      <div className="card filters-card">
        <h3>Filter Jobs</h3>
        <div className="filter-group">
          <label htmlFor="filterShip">Ship:</label>
          <select id="filterShip" value={filterShipId} onChange={(e) => setFilterShipId(e.target.value)}>
            <option value="">All Ships</option>
            {mockShips.map(ship => <option key={ship.id} value={ship.id}>{ship.name}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="filterStatus">Status:</label>
          <select id="filterStatus" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Statuses</option>
            {jobStatuses.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
        <div className="filter-group">
          <label htmlFor="filterPriority">Priority:</label>
          <select id="filterPriority" value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}>
            <option value="">All Priorities</option>
            {jobPriorities.map(priority => <option key={priority} value={priority}>{priority}</option>)}
          </select>
        </div>
      </div>

      <div className="card job-list-card">
        <h3>Filtered Jobs ({filteredJobs.length})</h3>
        {/* <JobList jobs={filteredJobs} onUpdateStatus={handleUpdateJobStatus} onEdit={handleEditJob} onDelete={handleDeleteJob} /> */}
        {filteredJobs.length === 0 ? (
          <p>No jobs match your filters.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Job ID</th>
                <th>Component</th> {/* Will fetch component name */}
                <th>Ship</th> {/* Will fetch ship name */}
                <th>Type</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Assigned</th> {/* Will fetch engineer name */}
                <th>Scheduled Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredJobs.map(job => (
                <tr key={job.id}>
                  <td>{job.id}</td>
                  <td>{job.componentId}</td> {/* Replace with name later */}
                  <td>{job.shipId}</td> {/* Replace with name later */}
                  <td>{job.type}</td>
                  <td>{job.priority}</td>
                  <td>
                    <select value={job.status} onChange={(e) => handleUpdateJobStatus(job.id, e.target.value)}>
                      {jobStatuses.map(status => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                  <td>{job.assignedEngineerld}</td> {/* Replace with name later */}
                  <td>{job.scheduledDate}</td>
                  <td>
                    <button className="btn-secondary" onClick={() => handleEditJob(job)}>Edit</button>
                    <button className="btn-danger" onClick={() => handleDeleteJob(job.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* <div className="card">
        <h3>Create/Edit Job</h3>
        <JobForm onSubmit={handleAddJob} />
      </div> */}
    </div>
  );
}

export default JobsPage;