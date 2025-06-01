// src/contexts/JobsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllJobs, saveJobs, generateUniqueId } from '../utils/localStorageUtils';
import { useNotifications } from './NotificationContext'; // Import useNotifications

const JobsContext = createContext(null);

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addNotification } = useNotifications(); // Get addNotification from NotificationContext

  // Load jobs on initial mount
  useEffect(() => {
    const loadJobs = async () => {
      try {
        setLoading(true);
        const storedJobs = await getAllJobs();
        setJobs(storedJobs);
      } catch (err) {
        console.error("Failed to load jobs:", err);
        setError("Failed to load jobs.");
        addNotification("Failed to load jobs.", 'error'); // Notify on load error
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, []);

  // Function to add a new job
  const addJob = async (newJobData) => {
    try {
      setLoading(true);
      const newJob = {
        id: generateUniqueId('j'),
        ...newJobData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedJobs = [...jobs, newJob];
      await saveJobs(updatedJobs);
      setJobs(updatedJobs);
      addNotification(`Job "${newJob.description || newJob.type}" created successfully!`, 'success'); // Notify on success
      return newJob;
    } catch (err) {
      console.error("Error adding job:", err);
      setError("Failed to add job.");
      addNotification(`Failed to create job: ${err.message}`, 'error'); // Notify on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to update an existing job
  const updateJob = async (updatedJobData) => {
    try {
      setLoading(true);
      const updatedJobs = jobs.map(job =>
        job.id === updatedJobData.id ? { ...updatedJobData, updatedAt: new Date().toISOString() } : job
      );
      await saveJobs(updatedJobs);
      setJobs(updatedJobs);
      addNotification(`Job "${updatedJobData.description || updatedJobData.type}" updated successfully!`, 'success'); // Notify on success
      return updatedJobData;
    } catch (err) {
      console.error("Error updating job:", err);
      setError("Failed to update job.");
      addNotification(`Failed to update job: ${err.message}`, 'error'); // Notify on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a job
  const deleteJob = async (jobId) => {
    try {
      setLoading(true);
      const jobToDelete = jobs.find(job => job.id === jobId);
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      await saveJobs(updatedJobs);
      setJobs(updatedJobs);
      addNotification(`Job "${jobToDelete?.description || jobToDelete?.type || 'N/A'}" deleted successfully!`, 'success'); // Notify on success
      return true;
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job.");
      addNotification(`Failed to delete job: ${err.message}`, 'error'); // Notify on error
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper to get jobs for a specific ship
  const getJobsByShipId = (shipId) => {
    return jobs.filter(job => job.shipId === shipId);
  };

  const value = {
    jobs,
    loading,
    error,
    addJob,
    updateJob,
    deleteJob,
    getJobById: (id) => jobs.find(job => job.id === id),
    getJobsByShipId,
  };

  return <JobsContext.Provider value={value}>{children}</JobsContext.Provider>;
};

export const useJobs = () => {
  const context = useContext(JobsContext);
  if (context === undefined) {
    throw new Error('useJobs must be used within a JobsProvider');
  }
  return context;
};