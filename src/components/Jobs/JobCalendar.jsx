// src/components/Jobs/JobCalendar.jsx
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Default calendar styles
import { useJobs } from '@/contexts/JobsContext';
import { useShips } from '@/contexts/ShipsContext'; // For ship names
import { useComponents } from '@/contexts/ComponentsContext'; // For component names
import { useAuth } from '@/contexts/AuthContext'; // For engineer names
import TimeAgo from '@/components/TimeAgo'; // Assuming TimeAgo is available

function JobCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { jobs, loading: loadingJobs, error: errorJobs } = useJobs();
  const { ships } = useShips();
  const { components } = useComponents();
  const { users: allUsers } = useAuth();

  // Helper functions for display
  const getShipName = (shipId) => ships.find(s => s.id === shipId)?.name || 'N/A';
  const getComponentName = (componentId) => components.find(c => c.id === componentId)?.name || 'N/A';
  const getEngineerEmail = (engineerId) => allUsers.find(u => u.id === engineerId)?.email || 'Unassigned';


  // Filter jobs for the selected date
  const jobsForSelectedDate = jobs.filter(job => {
    const jobDate = new Date(job.scheduledDate);
    return jobDate.toDateString() === selectedDate.toDateString();
  }).sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate)); // Sort by time

  // Function to add content to calendar tiles 
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayHasJobs = jobs.some(job => {
        const jobDate = new Date(job.scheduledDate);
        return jobDate.toDateString() === date.toDateString();
      });

      return dayHasJobs ? <div className="dot"></div> : null;
    }
  };

  if (loadingJobs) {
    return <div className="loading-fullscreen">Loading calendar jobs...</div>;
  }
  if (errorJobs) {
    return <div className="error-message">Error loading jobs for calendar: {errorJobs}</div>;
  }

  return (
    <div className="job-calendar-page card">
      <div className="main-content-header" style={{borderBottom: 'none', marginBottom: '1rem'}}>
         <h1>Maintenance Calendar</h1>
      </div>

      <div className="calendar-container">
        <Calendar
          onChange={setSelectedDate}
          value={selectedDate}
          tileContent={tileContent}
          
        />
      </div>

      <div className="jobs-for-date-section">
        <h2>Jobs on {selectedDate.toLocaleDateString()}</h2>
        {jobsForSelectedDate.length > 0 ? (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Job ID</th>
                  <th>Ship</th>
                  <th>Component</th>
                  <th>Type</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Scheduled Time</th>
                  <th>Last Update</th>
                </tr>
              </thead>
              <tbody>
                {jobsForSelectedDate.map(job => (
                  <tr key={job.id}>
                    <td>{job.id.substring(0, 6)}...</td>
                    <td>{getShipName(job.shipId)}</td>
                    <td>{getComponentName(job.componentId)}</td>
                    <td>{job.type}</td>
                    <td>{job.priority}</td>
                    <td>{job.status}</td>
                    <td>{getEngineerEmail(job.assignedEngineerId)}</td>
                    <td>{new Date(job.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                    <td><TimeAgo date={job.updatedAt || job.createdAt} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No jobs scheduled for this date.</p>
        )}
      </div>
    </div>
  );
}

export default JobCalendar;