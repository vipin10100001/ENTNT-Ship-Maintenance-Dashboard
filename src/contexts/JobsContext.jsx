// src/contexts/JobsContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllJobs, saveJobs, generateUniqueId, getAllUsers } from '../utils/localStorageUtils'; // Import getAllUsers to get engineers

const JobsContext = createContext(null);

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        id: generateUniqueId('j'), // Generate a unique ID, e.g., 'j12345'
        // Ensure newJobData includes componentId, shipId, type, priority, status, assignedEngineerId, scheduledDate
        ...newJobData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const updatedJobs = [...jobs, newJob];
      await saveJobs(updatedJobs); // Save to local storage
      setJobs(updatedJobs); // Update state
      return newJob;
    } catch (err) {
      console.error("Error adding job:", err);
      setError("Failed to add job.");
      throw err; // Re-throw to be caught by component
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
      return updatedJobData;
    } catch (err) {
      console.error("Error updating job:", err);
      setError("Failed to update job.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Function to delete a job
  const deleteJob = async (jobId) => {
    try {
      setLoading(true);
      const updatedJobs = jobs.filter(job => job.id !== jobId);
      await saveJobs(updatedJobs);
      setJobs(updatedJobs);
      return true;
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job.");
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
    getJobsByShipId, // Expose the helper
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