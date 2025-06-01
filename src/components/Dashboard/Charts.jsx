// src/components/Dashboard/Chart.jsx
import React from 'react';
import { Pie } from 'react-chartjs-2';

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';


ChartJS.register(ArcElement, Tooltip, Legend);

// pass the 'jobs' array to this Chart component from DashboardPage.jsx
function Chart({ jobs }) {
  // If jobs data is not available, handle loading/error states or empty display here
  // (DashboardPage will also handle global loading/error, but this is for specific chart data)
  if (!jobs) {
    return <p>Job data not available for chart.</p>;
  }

  // Aggregate job statuses
  const statusCounts = jobs.reduce((acc, job) => {
    acc[job.status] = (acc[job.status] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(statusCounts);
  const dataValues = Object.values(statusCounts);

  // Define colors for each status - customize these to match your theme
  const backgroundColors = labels.map(status => {
    switch (status) {
      case 'Open': return '#007bff'; // Primary Blue
      case 'In Progress': return '#ffc107'; // Yellow/Orange
      case 'Completed': return '#28a745'; // Accent Green
      case 'Pending': return '#17a2b8'; // Accent Teal
      case 'Cancelled': return '#dc3545'; // Accent Red
      default: return '#6c757d'; // Grey for unknown/other
    }
  });

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: '#ffffff', // White border between slices
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its container
    plugins: {
      legend: {
        position: 'right', // Position legend to the right
        labels: {
          color: '#343a40', // Dark text for legend labels
          font: {
            size: 14,
            family: 'Inter, sans-serif' // Consistent font
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed !== null) {
              label += `${context.parsed} jobs (${((context.parsed / dataValues.reduce((a, b) => a + b, 0)) * 100).toFixed(1)}%)`;
            }
            return label;
          }
        }
      }
    },
    layout: {
        padding: 10 // Add some padding around the chart
    }
  };

  // If there are no jobs, display a message
  if (jobs.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
        <p>No job data available to display in chart.</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '300px' }}> {/* Adjust height as needed */}
      <Pie data={chartData} options={chartOptions} />
    </div>
  );
}

export default Chart;