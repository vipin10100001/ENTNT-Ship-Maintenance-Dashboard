// src/components/Jobs/JobCalendar.jsx
// Displays scheduled jobs on a calendar view. [cite: 13]
import React, { useState } from 'react';
// import { useJobs } from '../../contexts/JobsContext';

function JobCalendar() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const { jobs } = useJobs();

  // Dummy function to get jobs for a specific date (will use actual jobs later)
  const getJobsForDate = (date) => {
    // return jobs.filter(job => new Date(job.scheduledDate).toDateString() === date.toDateString());
    return [{ id: 'dummy1', type: 'Inspection', status: 'Open', scheduledDate: date.toISOString().split('T')[0] }]; // Dummy data
  };

  const jobsOnSelectedDate = getJobsForDate(selectedDate);

  // Implement calendar rendering logic here (e.g., using a grid for days)
  // For now, just a placeholder.
  return (
    <div className="job-calendar-container">
      <h3>Maintenance Calendar</h3>
      <input type="date" value={selectedDate.toISOString().split('T')[0]} onChange={(e) => setSelectedDate(new Date(e.target.value))} />
      <p>Display scheduled jobs on a Calendar view (Monthly, Weekly). [cite: 12]</p>
      <p>Clicking a date should show jobs scheduled on that day. [cite: 13]</p>

      <h4>Jobs for {selectedDate.toDateString()}</h4>
      {jobsOnSelectedDate.length > 0 ? (
        <ul>
          {jobsOnSelectedDate.map(job => (
            <li key={job.id}>{job.type} - {job.status}</li>
          ))}
        </ul>
      ) : (
        <p>No jobs scheduled for this date.</p>
      )}
    </div>
  );
}

export default JobCalendar;