
import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";


import BedManagement from "./BedManagement";
import StaffManagement from "./StaffManagement";
import ResourceAnalytics from "./ResourceAnalytics";
import BottleneckAlerts from "./BottleneckAlerts";

function AdminDashboard() {
  const [currentDate, setCurrentDate] = useState("");

useEffect(() => {
  setCurrentDate(
    new Date().toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  );
}, []);
  const [activeSection, setActiveSection] = useState("Dashboard");

  const stats = [
    {
      title: "Total Patients",
      value: "1,248",
      icon: "👥",
      color: "blue",
    },
    {
      title: "Available Beds",
      value: "86",
      icon: "🛏️",
      color: "green",
    },
    {
      title: "Doctors",
      value: "64",
      icon: "🩺",
      color: "purple",
    },
    {
      title: "Staff Members",
      value: "142",
      icon: "👨‍⚕️",
      color: "orange",
    },
  ];

  return (
    <div className="admin-layout">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="admin-main">
        <Navbar />

        {activeSection === "Dashboard" ? (
          <section className="dashboard-content">
            <div className="page-heading">
              <div>
                <h1>Admin Dashboard</h1>
                <p>Welcome to CareSync Hospital Management</p>
<p className="dashboard-date">{currentDate}</p>
              </div>

              <div className="dashboard-heading-actions">
  <button
    type="button"
    className="refresh-button"
    onClick={() => window.location.reload()}
  >
    ↻ Refresh Dashboard
  </button>

  <span className="status-badge">● System Online</span>
</div>
            </div>

            <div className="stats-grid">
              {stats.map((stat) => (
                <StatCard key={stat.title} {...stat} />
              ))}
            </div>

            <div className="dashboard-grid">
              <section className="panel overview-panel">
                <h2>Hospital Overview</h2>

                <p className="panel-description">
                  A quick overview of hospital operations.
                </p>

                <div className="overview-item">
                  <span>Occupied Beds</span>
                  <strong>214</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: "72%" }}
                  />
                </div>

                <div className="overview-item">
                  <span>Available Beds</span>
                  <strong>86</strong>
                </div>

                <div className="progress-track">
                  <div
                    className="progress-fill green-fill"
                    style={{ width: "28%" }}
                  />
                </div>

                <div className="overview-item">
                  <span>Pending Appointments</span>
                  <strong>18</strong>
                </div>
              </section>

              <section className="panel alerts-panel">
                <h2>Recent Alerts</h2>

                <p className="panel-description">
                  Items that may need administrator attention.
                </p>

                <div className="alert-item warning-alert">
                  <span>!</span>
                  <div>
                    <strong>Bed Capacity</strong>
                    <p>
                      Review occupancy in high-demand wards.
                    </p>
                  </div>
                </div>

                <div className="alert-item info-alert">
                  <span>i</span>
                  <div>
                    <strong>Staff Scheduling</strong>
                    <p>
                      Check upcoming shift assignments.
                    </p>
                  </div>
                </div>

                <div className="alert-item success-alert">
                  <span>✓</span>
                  <div>
                    <strong>System Status</strong>
                    <p>
                      Dashboard interface is ready for testing.
                    </p>
                  </div>
                </div>
              </section>
            </div>

            <section className="panel activity-panel">
              <h2>Recent Hospital Activity</h2>

              <div className="activity-row">
                <span className="activity-dot blue-dot" />
                <div>
                  <strong>Patient Management</strong>
                  <p>Patient overview section is available.</p>
                </div>
                <time>Overview</time>
              </div>

              <div className="activity-row">
                <span className="activity-dot green-dot" />
                <div>
                  <strong>Bed Management</strong>
                  <p>Bed occupancy summary is displayed.</p>
                </div>
                <time>Overview</time>
              </div>

              <div className="activity-row">
                <span className="activity-dot orange-dot" />
                <div>
                  <strong>Staff Management</strong>
                  <p>Staff summary is displayed.</p>
                </div>
                <time>Overview</time>
              </div>
            </section>

            <p className="dashboard-footer">
              CareSync · Smart Healthcare Management
            </p>
          </section>
        ) : activeSection === "Bed Management" ? (
          <BedManagement />
        ) : activeSection === "Staff Management" ? (
          <StaffManagement />
        ) : activeSection === "Resource Analytics" ? (
          <ResourceAnalytics />
        ) : activeSection === "Bottleneck Alerts" ? (
          <BottleneckAlerts />
        ) : null}
      </main>
    </div>
  );
}

export default AdminDashboard;
