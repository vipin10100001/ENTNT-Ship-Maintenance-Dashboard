// src/components/Notifications/NotificationCenter.jsx
import React from 'react';
import { useNotifications } from '@/contexts/NotificationContext';

function NotificationCenter() {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="notification-center">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification-item notification-item--${notification.type}`}
          role="alert"
        >
          <span>{notification.message}</span>
          <button
            onClick={() => removeNotification(notification.id)}
            className="notification-dismiss"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}

export default NotificationCenter;