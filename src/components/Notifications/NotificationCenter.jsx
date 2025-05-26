// src/components/Notifications/NotificationCenter.jsx
// In-app notification system. [cite: 14]
import React, { useState, useEffect } from 'react';
// import { useNotifications } from '../../contexts/NotificationContext'; // Will create this context later

function NotificationCenter() {
  // Dummy notifications for now
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Welcome to the dashboard!', type: 'info', dismissible: true },
    { id: 2, message: 'Job J1 created for Ever Given.', type: 'success', dismissible: true },
  ]);

  const dismissNotification = (id) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // When NotificationContext is ready, you'll replace `notifications` state with context state
  // and `dismissNotification` with context's dismiss function.

  if (notifications.length === 0) {
    return null; // Don't render if no notifications
  }

  return (
    <div className="notification-center-container">
      <h3>Notifications</h3>
      <div className="notifications-list">
        {notifications.map((notif) => (
          <div key={notif.id} className={`notification-item notification-${notif.type}`}>
            <p>{notif.message}</p>
            {notif.dismissible && (
              <button onClick={() => dismissNotification(notif.id)}>Dismiss</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationCenter;