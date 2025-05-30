// src/components/TimeAgo.jsx
import React, { useState, useEffect } from 'react';

// This function calculates the time difference and formats it
const formatTimeAgo = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);

  let interval = seconds / 31536000; // seconds in a year
  if (interval > 1) {
    return Math.floor(interval) + " years ago";
  }
  interval = seconds / 2592000; // seconds in a month
  if (interval > 1) {
    return Math.floor(interval) + " months ago";
  }
  interval = seconds / 86400; // seconds in a day
  if (interval > 1) {
    return Math.floor(interval) + " days ago";
  }
  interval = seconds / 3600; // seconds in an hour
  if (interval > 1) {
    return Math.floor(interval) + " hours ago";
  }
  interval = seconds / 60; // seconds in a minute
  if (interval > 1) {
    return Math.floor(interval) + " minutes ago";
  }
  return Math.floor(seconds) + " seconds ago";
};

function TimeAgo({ date }) {
  const [timeAgo, setTimeAgo] = useState(() => formatTimeAgo(date));

  // Update every minute (or more frequently if needed for seconds/minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(date));
    }, 60000); // Update every 60 seconds (1 minute)

    return () => clearInterval(interval); // Clean up on unmount
  }, [date]); // Re-run if the date prop changes

  return <time dateTime={date}>{timeAgo}</time>;
}

export default TimeAgo;