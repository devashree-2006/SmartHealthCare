
import { useEffect, useState, useCallback } from "react";
import adminCss from "./admin.css?inline";

import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import StatCard from "../../components/StatCard";

import BedManagement from "./BedManagement";
import StaffManagement from "./StaffManagement";
import ResourceAnalytics from "./ResourceAnalytics";
import BottleneckAlerts from "./BottleneckAlerts";
import ActivityLog from "./ActivityLog";

import {
  getAdminDashboardStats,
  getBottleneckAlerts,
} from "../../services/adminApi";

const initialStats = {
  beds: {
    total: 0,
    available: 0,
    occupied: 0,
  },
  staff: {
    total: 0,
    onDuty: 0,
    offDuty: 0,
  },
};

function AdminDashboard({ onLogout }) {
  const [currentDate, setCurrentDate] = useState("");
  const [activeSection, setActiveSection] = useState("Dashboard");

  useEffect(() => {
    const style = document.createElement("style");
    style.dataset.adminStyles = "true";
    style.textContent = adminCss;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  const [dashboardStats, setDashboardStats] = useState(initialStats);
  const [alerts, setAlerts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  // Fetch dashboard information
  const fetchDashboardData = useCallback(async () => {
    try {
      setError("");
      setLoading(true);

      const [statsData, alertsData] = await Promise.all([
        getAdminDashboardStats(),
        getBottleneckAlerts(),
      ]);

      setDashboardStats({
        beds: {
          total: Number(statsData?.beds?.total) || 0,
          available: Number(statsData?.beds?.available) || 0,
          occupied: Number(statsData?.beds?.occupied) || 0,
        },
        staff: {
          total: Number(statsData?.staff?.total) || 0,
          onDuty: Number(statsData?.staff?.onDuty) || 0,
          offDuty: Number(statsData?.staff?.offDuty) || 0,
        },
      });

      setAlerts(Array.isArray(alertsData) ? alertsData : []);

      setLastUpdated(new Date().toLocaleTimeString("en-IN"));
    } catch (err) {
      console.error("Unable to load dashboard:", err);
      setError("Unable to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load dashboard when opened
  useEffect(() => {
    fetchDashboardData();

    setCurrentDate(
      new Date().toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, [fetchDashboardData]);

  // Bed statistics
  const totalBeds = dashboardStats.beds.total;
  const availableBeds = dashboardStats.beds.available;
  const occupiedBeds = dashboardStats.beds.occupied;

  // Staff statistics
  const totalStaff = dashboardStats.staff.total;
  const onDutyStaff = dashboardStats.staff.onDuty;
  const offDutyStaff = dashboardStats.staff.offDuty;

  // Calculate percentages
  const occupancyRate =
    totalBeds > 0
      ? Math.min(100, Math.round((occupiedBeds / totalBeds) * 100))
      : 0;

  const availabilityRate =
    totalBeds > 0
      ? Math.min(100, Math.round((availableBeds / totalBeds) * 100))
      : 0;

  const staffDutyRate =
    totalStaff > 0
      ? Math.min(100, Math.round((onDutyStaff / totalStaff) * 100))
      : 0;

  const staffOffDutyRate =
    totalStaff > 0
      ? Math.min(100, Math.round((offDutyStaff / totalStaff) * 100))
      : 0;

  // Dashboard statistics cards
  const stats = [
    {
      title: "Total Beds",
      value: totalBeds.toString(),
      icon: "▦",
      color: "blue",
    },
    {
      title: "Available Beds",
      value: availableBeds.toString(),
      icon: "✓",
      color: "green",
    },
    {
      title: "Occupied Beds",
      value: occupiedBeds.toString(),
      icon: "▤",
      color: "purple",
    },
    {
      title: "Staff Members",
      value: totalStaff.toString(),
      icon: "♙",
      color: "orange",
    },
  ];

  // Alert calculations
  const criticalAlerts = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "Active"
  ).length;

  // Module navigation
  const renderActiveSection = () => {
    switch (activeSection) {
      case "Dashboard":
        return null;

      case "Bed Management":
        return <BedManagement />;

      case "Staff Management":
        return <StaffManagement />;

      case "Resource Analytics":
        return <ResourceAnalytics />;

      case "Bottleneck Alerts":
        return <BottleneckAlerts />;

      case "Activity Log":
        return <ActivityLog />;

      default:
        return null;
    }
  };

  return (
    <div className="admin-layout">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="admin-main">
        <Navbar onLogout={onLogout} />

        {activeSection === "Dashboard" ? (
          <section className="dashboard-content">

            {/* Dashboard Header */}
            <div className="page-heading dashboard-header">
              <div>
                <span className="dashboard-eyebrow">
                  CARESYNC HOSPITAL MANAGEMENT
                </span>

                <h1>Admin Dashboard</h1>

                <p className="dashboard-welcome">
                  Welcome back! Here's your hospital overview.
                </p>

                <p className="dashboard-date">
                  {currentDate}
                </p>
              </div>

              <div className="dashboard-heading-actions">
                <span
                  className={`status-badge ${
                    error ? "status-error" : "status-success"
                  }`}
                >
                  <span className="status-indicator" />
                  {error ? "Data Unavailable" : "Data Loaded"}
                </span>

                <button
                  type="button"
                  className="refresh-button dashboard-refresh"
                  onClick={fetchDashboardData}
                  disabled={loading}
                >
                  <span>{loading ? "↻" : "⟳"}</span>
                  {loading ? "Refreshing..." : "Refresh Dashboard"}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="dashboard-error" role="alert">
                <span>{error}</span>

                <button
                  type="button"
                  onClick={fetchDashboardData}
                  disabled={loading}
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="dashboard-loading">
                <div className="dashboard-loader" />
                <p>Loading hospital information...</p>
              </div>
            ) : (
              <>

                {/* Statistics Cards */}
                <div className="stats-grid">
                  {stats.map((stat) => (
                    <StatCard
                      key={stat.title}
                      {...stat}
                    />
                  ))}
                </div>

                {/* Main Dashboard Grid */}
                <div className="dashboard-grid">

                  {/* Hospital Overview */}
                  <section className="panel overview-panel">
                    <div className="panel-header">
                      <div>
                        <h2>Hospital Overview</h2>
                        <p className="panel-description">
                          Current hospital resource utilization.
                        </p>
                      </div>

                      <span className="panel-icon">▦</span>
                    </div>

                    {/* Bed Occupancy */}
                    <div className="resource-block">
                      <div className="resource-heading">
                        <span>Bed Occupancy</span>
                        <strong>{occupancyRate}%</strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${occupancyRate}%` }}
                        />
                      </div>

                      <p className="resource-caption">
                        {occupiedBeds} occupied out of {totalBeds} beds
                      </p>
                    </div>

                    {/* Bed Availability */}
                    <div className="resource-block">
                      <div className="resource-heading">
                        <span>Bed Availability</span>
                        <strong>{availabilityRate}%</strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill green-fill"
                          style={{ width: `${availabilityRate}%` }}
                        />
                      </div>

                      <p className="resource-caption">
                        {availableBeds} beds currently available
                      </p>
                    </div>

                    <div className="panel-divider" />

                    <h3 className="resource-subheading">
                      Staff Availability
                    </h3>

                    {/* Staff On Duty */}
                    <div className="resource-block">
                      <div className="resource-heading">
                        <span>On Duty</span>
                        <strong>{onDutyStaff} / {totalStaff}</strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill green-fill"
                          style={{ width: `${staffDutyRate}%` }}
                        />
                      </div>

                      <p className="resource-caption">
                        {staffDutyRate}% of registered staff
                      </p>
                    </div>

                    {/* Staff Off Duty */}
                    <div className="resource-block">
                      <div className="resource-heading">
                        <span>Off Duty</span>
                        <strong>{offDutyStaff} / {totalStaff}</strong>
                      </div>

                      <div className="progress-track">
                        <div
                          className="progress-fill"
                          style={{ width: `${staffOffDutyRate}%` }}
                        />
                      </div>

                      <p className="resource-caption">
                        {staffOffDutyRate}% of registered staff
                      </p>
                    </div>
                  </section>

                  {/* Recent Alerts */}
                  <section className="panel alerts-panel">
                    <div className="panel-header">
                      <div>
                        <h2>Recent Alerts</h2>
                        <p className="panel-description">
                          Hospital bottleneck monitoring and notifications.
                        </p>
                      </div>

                      <span className="panel-icon alert-panel-icon">!</span>
                    </div>

                    <div className="alert-summary-grid">
                      <div className="alert-summary-card">
                        <span>Total Alerts</span>
                        <strong>{alerts.length}</strong>
                      </div>

                      <div className="alert-summary-card critical-summary">
                        <span>Critical</span>
                        <strong>{criticalAlerts}</strong>
                      </div>

                      <div className="alert-summary-card active-summary">
                        <span>Active</span>
                        <strong>{activeAlerts}</strong>
                      </div>
                    </div>

                    <h3 className="resource-subheading">
                      Latest Notifications
                    </h3>

                    {alerts.length === 0 ? (
                      <div className="empty-alerts">
                        <span>✓</span>
                        <strong>No Current Alerts</strong>
                        <p>
                          There are currently no bottleneck alerts to display.
                        </p>
                      </div>
                    ) : (
                      <div className="recent-alert-list">
                        {alerts.slice(0, 3).map((alert, index) => (
                          <div
                            className="alert-item warning-alert"
                            key={alert._id || alert.id || index}
                          >
                            <span className="alert-indicator">!</span>

                            <div className="alert-content">
                              <strong>
                                {alert.title || "Untitled Alert"}
                              </strong>

                              <p>
                                {alert.description || "No description available."}
                              </p>

                              <small>
                                {alert.severity || "Unspecified"} ·{" "}
                                {alert.status || "Unknown"}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      className="view-alerts-button"
                      onClick={() =>
                        setActiveSection("Bottleneck Alerts")
                      }
                    >
                      View All Alerts →
                    </button>
                  </section>
                </div>

                {/* Resource Summary */}
                <section className="panel activity-panel">
                  <div className="panel-header">
                    <div>
                      <h2>Resource Summary</h2>
                      <p className="panel-description">
                        Overview of registered hospital resources.
                      </p>
                    </div>

                    <span className="panel-icon">◈</span>
                  </div>

                  <div className="resource-summary-grid">

                    <div className="resource-summary-item">
                      <span className="activity-dot blue-dot" />

                      <div>
                        <strong>Bed Management</strong>
                        <p>
                          {totalBeds} beds registered in the database.
                        </p>
                      </div>
                    </div>

                    <div className="resource-summary-item">
                      <span className="activity-dot green-dot" />

                      <div>
                        <strong>Staff Management</strong>
                        <p>
                          {totalStaff} staff members registered,{" "}
                          {onDutyStaff} currently on duty.
                        </p>
                      </div>
                    </div>

                    <div className="resource-summary-item">
                      <span className="activity-dot orange-dot" />

                      <div>
                        <strong>Bottleneck Monitoring</strong>
                        <p>
                          {activeAlerts} active alerts detected.
                        </p>
                      </div>
                    </div>

                  </div>

                  <div className="last-updated">
                    <span>Last updated</span>
                    <strong>
                      {lastUpdated || "Not updated yet"}
                    </strong>
                  </div>
                </section>
              </>
            )}

            {/* Dashboard Footer */}
            <footer className="dashboard-footer">
              CareSync · Smart Healthcare Management
            </footer>
          </section>
        ) : (
          renderActiveSection()
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
