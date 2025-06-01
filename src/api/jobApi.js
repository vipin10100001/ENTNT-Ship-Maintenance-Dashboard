// src/api/jobApi.js
import { getAllJobs, saveJobs, generateUniqueId } from '../utils/localStorageUtils';

export const addJob = async (newJobData) => {
    const jobs = await getAllJobs();
    const newJob = { ...newJobData, id: generateUniqueId('j') }; // Generate ID here if not in form
    const updatedJobs = [...jobs, newJob];
    await saveJobs(updatedJobs);
    return newJob;
};

export const updateJob = async (jobId, updatedData) => {
    const jobs = await getAllJobs();
    const updatedJobs = jobs.map(job =>
        job.id === jobId ? { ...job, ...updatedData } : job
    );
    await saveJobs(updatedJobs);
    return updatedData;
};

export const deleteJob = async (jobId) => {
    const jobs = await getAllJobs();
    const updatedJobs = jobs.filter(job => job.id !== jobId);
    await saveJobs(updatedJobs);
    return true;
};

