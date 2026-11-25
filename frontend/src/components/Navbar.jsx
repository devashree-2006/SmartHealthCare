
import { useState } from "react";

function Navbar({ onLogout }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeDetails, setActiveDetails] = useState("");

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

  const closeDetails = () => setActiveDetails("");

  const CloseIcon = () => (
    <svg viewBox="0 0 24 24" width="18" height="18"
      fill="none" stroke="currentColor" strokeWidth="2"
      strokeLinecap="round">
      <path d="m18 6-12 12M6 6l12 12" />
    </svg>
  );

  return (
    <>
      <header className="admin-navbar">
        <div className="navbar-title">
          <h2>Hospital Administration</h2>
          <p>Manage your hospital operations in one place</p>
        </div>

        <div className="navbar-right">
          <button type="button" className="logout-button" onClick={onLogout}>Log out</button>
          <div className="notification-wrapper">
            <button
              type="button"
              className="notification-button"
              aria-label="Toggle notifications"
              aria-expanded={showNotifications}
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfile(false);
              }}
            >
              <svg viewBox="0 0 24 24" width="21" height="21"
                fill="none" stroke="currentColor" strokeWidth="1.8"
                strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />
                <path d="M10 21h4" />
              </svg>
              <span className="notification-dot" />
            </button>

            {showNotifications && (
              <div className="notification-panel">
                <div className="notification-panel-header">
                  <h3>Notifications</h3>
                  <button
                    type="button"
                    className="notification-close"
                    aria-label="Close notifications"
                    onClick={() => setShowNotifications(false)}
                  >
                    <CloseIcon />
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

          <div className="admin-profile-wrapper">
            <button
              type="button"
              className="admin-profile"
              aria-expanded={showProfile}
              onClick={() => {
                setShowProfile(!showProfile);
                setShowNotifications(false);
              }}
            >
              <div className="admin-avatar">A</div>
              <div>
                <strong>Administrator</strong>
                <p>Hospital Admin</p>
              </div>
              <svg viewBox="0 0 24 24" width="16" height="16"
                fill="none" stroke="currentColor" strokeWidth="2"
                strokeLinecap="round">
                <path d="m7 10 5 5 5-5" />
              </svg>
            </button>

            {showProfile && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <div className="admin-avatar">A</div>
                  <div>
                    <strong>Administrator</strong>
                    <p>Hospital Admin</p>
                  </div>
                </div>

                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={() => {
                    setActiveDetails("administrator");
                    setShowProfile(false);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="19" height="19"
                    fill="none" stroke="currentColor" strokeWidth="1.8">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                  </svg>
                  <span>Administrator Profile</span>
                </button>

                <button
                  type="button"
                  className="profile-dropdown-item"
                  onClick={() => {
                    setActiveDetails("hospital");
                    setShowProfile(false);
                  }}
                >
                  <svg viewBox="0 0 24 24" width="19" height="19"
                    fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 21h18M5 21V5h14v16M9 9h2m2 0h2m-6 4h2m2 0h2M10 21v-4h4v4" />
                    <path d="M10 2h4v3h-4z" />
                  </svg>
                  <span>CareSync Hospital</span>
                </button>

                <button
                  type="button"
                  className="profile-close-button"
                  onClick={() => setShowProfile(false)}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {activeDetails && (
        <div
          className="profile-modal-overlay"
          onClick={closeDetails}
        >
          <div
            className="profile-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="profile-modal-header">
              <h3>
                {activeDetails === "administrator"
                  ? "Administrator Profile"
                  : "Hospital Information"}
              </h3>

              <button
                type="button"
                aria-label="Close dialog"
                onClick={closeDetails}
              >
                <CloseIcon />
              </button>
            </div>

            {activeDetails === "administrator" ? (
              <div className="profile-details">
                <div className="profile-large-avatar">A</div>
                <h2>Administrator</h2>
                <p className="profile-role">Hospital Admin</p>

                <div className="profile-info-row">
                  <strong>Name</strong>
                  <span>Administrator</span>
                </div>

                <div className="profile-info-row">
                  <strong>Role</strong>
                  <span>Hospital Administrator</span>
                </div>

                <div className="profile-info-row">
                  <strong>Organization</strong>
                  <span>CareSync Hospital</span>
                </div>
              </div>
            ) : (
              <div className="profile-details">
                <div className="hospital-large-icon">
                  <svg viewBox="0 0 24 24" width="42" height="42"
                    fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M3 21h18M5 21V5h14v16M9 9h2m2 0h2m-6 4h2m2 0h2M10 21v-4h4v4" />
                    <path d="M10 2h4v3h-4z" />
                  </svg>
                </div>
                <h2>CareSync Hospital</h2>
                <p className="profile-role">
                  Smart Healthcare Management System
                </p>

                <div className="profile-info-row">
                  <strong>Hospital Name</strong>
                  <span>CareSync Hospital</span>
                </div>

                <div className="profile-info-row">
                  <strong>System</strong>
                  <span>CareSync</span>
                </div>

                <div className="profile-info-row">
                  <strong>Department</strong>
                  <span>Hospital Administration</span>
                </div>

                <p className="profile-note">
                  Hospital address and contact information
                  have not been configured yet.
                </p>
              </div>
            )}

            <button
              type="button"
              className="profile-modal-close"
              onClick={closeDetails}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;
