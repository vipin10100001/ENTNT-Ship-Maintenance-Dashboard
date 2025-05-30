// src/pages/DashboardPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useShips } from '@/contexts/ShipsContext';
import { useJobs } from '@/contexts/JobsContext';
import { useComponents } from '@/contexts/ComponentsContext';
import TimeAgo from '@/components/TimeAgo'; // Assuming this component exists

// Import your existing Chart component
import Chart from '@/components/Dashboard/Charts'; // Import your Chart.jsx

function DashboardPage() {
  const { currentUser, loading: loadingAuth, error: errorAuth } = useAuth();
  const { ships, loading: loadingShips, error: errorShips } = useShips();
  const { jobs, loading: loadingJobs, error: errorJobs } = useJobs();
  const { components, loading: loadingComponents, error: errorComponents } = useComponents();
  const navigate = useNavigate();

  // --- KPI Calculations ---
  const totalShips = ships.length;
  const jobsInProgress = jobs.filter(job => job.status === 'In Progress').length;
  const completedJobs = jobs.filter(job => job.status === 'Completed').length;

  const overdueMaintenanceJobs = jobs.filter(job =>
    new Date(job.scheduledDate) < new Date() &&
    (job.status === 'Open' || job.status === 'In Progress' || job.status === 'Pending')
  );
  const componentsWithOverdueMaintenance = new Set(overdueMaintenanceJobs.map(job => job.componentId)).size;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const recentJobs = jobs.filter(job => new Date(job.createdAt) >= oneWeekAgo)
                         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                         .slice(0, 5);


  // --- Loading and Error Handling ---
  if (loadingAuth || loadingShips || loadingJobs || loadingComponents) {
    return <div className="loading-fullscreen">Loading dashboard data...</div>;
  }

  if (errorAuth || errorShips || errorJobs || errorComponents) {
    return <div className="error-message">Error loading dashboard: {errorAuth || errorShips || errorJobs || errorComponents}</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="main-content-header">
        <h1>Welcome, {currentUser ? currentUser.username || currentUser.email : 'Guest'}!</h1>
      </div>

      {/* KPI Cards Grid */}
      <div className="dashboard-stats-grid">
        <div className="card stat-card">
          <h3>Total Ships</h3>
          <p>{totalShips}</p>
        </div>
        <div className="card stat-card">
          <h3>Components with Overdue Maintenance</h3>
          <p>{componentsWithOverdueMaintenance}</p>
        </div>
        <div className="card stat-card">
          <h3>Jobs in Progress</h3>
          <p>{jobsInProgress}</p>
        </div>
        <div className="card stat-card">
          <h3>Completed Jobs</h3>
          <p>{completedJobs}</p>
        </div>
      </div>

      {/* Dashboard Sections Grid */}
      <div className="dashboard-sections-grid">
        <div className="card recent-jobs-section">
          <h2>Recent Job Updates</h2>
          {recentJobs.length > 0 ? (
            <div className="table-responsive"> {/* Ensure this wrapper is here */}
              <table>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Description</th>
                    <th>Ship</th>
                    <th>Status</th>
                    <th>Last Update</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map(job => (
                    <tr key={job.id} onClick={() => navigate(`/jobs`)} style={{ cursor: 'pointer' }}>
                      <td>{job.id.substring(0, 6)}...</td>
                      <td>{job.description || job.type}</td>
                      <td>{ships.find(s => s.id === job.shipId)?.name || 'N/A'}</td>
                      <td>{job.status}</td>
                      <td>
                        <TimeAgo date={job.updatedAt || job.createdAt} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No recent job updates.</p>
          )}
        </div>

        <div className="card overdue-jobs-section">
          <h2>Overdue Maintenance Jobs</h2>
          {overdueMaintenanceJobs.length > 0 ? (
            <div className="table-responsive"> {/* Ensure this wrapper is here */}
              <table>
                <thead>
                  <tr>
                    <th>Job ID</th>
                    <th>Ship</th>
                    <th>Priority</th>
                    <th>Scheduled Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {overdueMaintenanceJobs.map(job => (
                    <tr key={job.id} onClick={() => navigate(`/jobs`)} style={{ cursor: 'pointer' }}>
                      <td>{job.id.substring(0, 6)}...</td>
                      <td>{ships.find(s => s.id === job.shipId)?.name || 'N/A'}</td>
                      <td>{job.priority}</td>
                      <td>{job.scheduledDate}</td>
                      <td>{job.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p>No jobs currently overdue.</p>
          )}
        </div>

        {/* Render your Chart component here */}
        <div className="card chart-placeholder">
          <h2>Job Status Distribution</h2>
          <Chart jobs={jobs} /> {/* Pass the 'jobs' array to your Chart component */}
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;