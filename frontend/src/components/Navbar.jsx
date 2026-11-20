
import { useState } from "react";

function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      title: "High ICU Occupancy",
      message: "Review available beds in the ICU.",
      time: "10:30 AM",
      type: "warning",
    },
    {
      id: 2,
      title: "Staff Scheduling",
      message: "Check upcoming shift assignments.",
      time: "10:15 AM",
      type: "info",
    },
    {
      id: 3,
      title: "System Status",
      message: "CareSync dashboard is ready.",
      time: "09:45 AM",
      type: "success",
    },
  ];

  return (
    <header className="admin-navbar">
      <div className="navbar-title">
        <h2>Hospital Administration</h2>
        <p>Manage your hospital operations in one place</p>
      </div>

      <div className="navbar-right">
        <div className="notification-wrapper">
          <button
            type="button"
            className="notification-button"
            aria-label="Toggle notifications"
            aria-expanded={showNotifications}
            onClick={() =>
              setShowNotifications((previous) => !previous)
            }
          >
            🔔
            <span className="notification-dot" />
          </button>

          {showNotifications && (
            <div className="notification-panel">
              <div className="notification-panel-header">
                <h3>Notifications</h3>
                <button
                  type="button"
                  className="notification-close"
                  onClick={() => setShowNotifications(false)}
                  aria-label="Close notifications"
                >
                  ×
                </button>
              </div>

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="notification-item"
                >
                  <span
                    className={`notification-type ${notification.type}`}
                  />
                  <div className="notification-content">
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <small>{notification.time}</small>
                  </div>
                </div>
              ))}

              <div className="notification-footer">
                Demo notifications · Not live alerts
              </div>
            </div>
          )}
        </div>

        <div className="admin-profile">
          <div className="admin-avatar">A</div>
          <div>
            <strong>Administrator</strong>
            <p>Hospital Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
