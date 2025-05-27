// src/contexts/JobsContext.jsx
// This file will manage the state and operations for maintenance jobs.
// It will utilize localStorageUtils for data persistence.
import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAllJobs, saveJobs } from '../utils/localStorageUtils';

const JobsContext = createContext(null);

export const JobsProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const storedJobs = await getAllJobs();
      setJobs(storedJobs);
      setLoading(false);
    };
    loadData();
  }, []);

  const addJob = async (jobData) => {
    const newJob = { id: `j${Date.now()}`, ...jobData }; // Generate unique ID
    const updatedJobs = [...jobs, newJob];
    setJobs(updatedJobs);
    await saveJobs(updatedJobs); // Persist to storage [cite: 17]
    // Trigger notification: Job Created [cite: 14]
    return newJob;
  };

  const updateJobStatus = async (id, newStatus) => {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? { ...job, status: newStatus } : job
    );
    setJobs(updatedJobs);
    await saveJobs(updatedJobs); // Persist to storage [cite: 12, 17]
    // Trigger notification: Job Updated [cite: 14]
    return updatedJobs.find(job => job.id === id);
  };

  const editJob = async (id, updatedData) => {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? { ...job, ...updatedData } : job
    );
    setJobs(updatedJobs);
    await saveJobs(updatedJobs); // Persist to storage [cite: 17]
    // Trigger notification: Job Updated (or Completed if status changes to complete) [cite: 14]
    return updatedJobs.find(job => job.id === id);
  };

  const getJobsByShipId = (shipId) => {
    return jobs.filter(job => job.shipId === shipId);
  };

  const getJobById = (id) => {
    return jobs.find(job => job.id === id);
  };

  const filterAndGetJobs = (shipId, status, priority) => { [cite: 11]
    let filtered = jobs;
    if (shipId) filtered = filtered.filter(job => job.shipId === shipId);
    if (status) filtered = filtered.filter(job => job.status === status);
    if (priority) filtered = filtered.filter(job => job.priority === priority);
    return filtered;
  };

  const value = {
    jobs,
    addJob,
    updateJobStatus,
    editJob,
    getJobsByShipId,
    getJobById,
    filterAndGetJobs,
    loadingJobs: loading,
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