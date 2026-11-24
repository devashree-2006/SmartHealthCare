
import React, { useEffect, useState } from "react";
import { getActivityLogs } from "../../services/adminApi";

const ActivityLog = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [moduleFilter, setModuleFilter] = useState("All");
  const [actionFilter, setActionFilter] = useState("All");

  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getActivityLogs();
      setActivities(Array.isArray(data) ? data : data.value || []);
    } catch (err) {
      setError(err.message || "Failed to load activity logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((activity) => {
    const matchesModule =
      moduleFilter === "All" || activity.module === moduleFilter;

    const matchesAction =
      actionFilter === "All" || activity.action === actionFilter;

    return matchesModule && matchesAction;
  });

  const getActionColor = (action) => {
    switch (action) {
      case "CREATE":
        return "#16a34a";
      case "UPDATE":
        return "#2563eb";
      case "DELETE":
        return "#dc2626";
      default:
        return "#64748b";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Admin Activity Log</h1>
          <p style={styles.subtitle}>
            Track administrative activities and changes across hospital resources.
          </p>
        </div>

        <button style={styles.refreshButton} onClick={fetchActivities}>
          ↻ Refresh Logs
        </button>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <p>Total Activities</p>
          <h2>{activities.length}</h2>
        </div>

        <div style={styles.statCard}>
          <p>Created</p>
          <h2 style={{ color: "#16a34a" }}>
            {activities.filter((a) => a.action === "CREATE").length}
          </h2>
        </div>

        <div style={styles.statCard}>
          <p>Updated</p>
          <h2 style={{ color: "#2563eb" }}>
            {activities.filter((a) => a.action === "UPDATE").length}
          </h2>
        </div>

        <div style={styles.statCard}>
          <p>Deleted</p>
          <h2 style={{ color: "#dc2626" }}>
            {activities.filter((a) => a.action === "DELETE").length}
          </h2>
        </div>
      </div>

      <div style={styles.logCard}>
        <div style={styles.filterSection}>
          <div>
            <h2 style={styles.sectionTitle}>Activity History</h2>
            <p style={styles.subtitle}>
              Recent administrative actions
            </p>
          </div>

          <div style={styles.filters}>
            <select
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Modules</option>
              <option value="Bed Management">Bed Management</option>
              <option value="Staff Management">Staff Management</option>
            </select>

            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              style={styles.select}
            >
              <option value="All">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p style={styles.message}>Loading activity logs...</p>
        ) : error ? (
          <div style={styles.error}>
            {error}
            <button style={styles.retryButton} onClick={fetchActivities}>
              Retry
            </button>
          </div>
        ) : filteredActivities.length === 0 ? (
          <p style={styles.message}>No activities found.</p>
        ) : (
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Action</th>
                  <th style={styles.th}>Module</th>
                  <th style={styles.th}>Description</th>
                  <th style={styles.th}>Performed By</th>
                  <th style={styles.th}>Date & Time</th>
                </tr>
              </thead>

              <tbody>
                {filteredActivities.map((activity) => (
                  <tr key={activity._id}>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.actionBadge,
                          backgroundColor: `${getActionColor(activity.action)}18`,
                          color: getActionColor(activity.action),
                        }}
                      >
                        {activity.action}
                      </span>
                    </td>

                    <td style={styles.td}>{activity.module}</td>
                    <td style={styles.td}>{activity.description}</td>
                    <td style={styles.td}>{activity.performedBy}</td>
                    <td style={styles.td}>
                      {new Date(activity.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <p style={styles.footer}>
          Showing {filteredActivities.length} of {activities.length} activities
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    color: "#1e293b",
    fontFamily: "inherit",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "24px",
  },
  title: {
    fontSize: "26px",
    fontWeight: "700",
    margin: "0 0 8px",
  },
  subtitle: {
    color: "#64748b",
    fontSize: "14px",
    margin: "4px 0",
  },
  refreshButton: {
    padding: "11px 18px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
  },
  logCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    padding: "20px",
  },
  filterSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "16px",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "19px",
    fontWeight: "700",
    margin: "0",
  },
  filters: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  select: {
    padding: "10px",
    border: "1px solid #cbd5e1",
    borderRadius: "7px",
    background: "#fff",
  },
  tableWrapper: {
    width: "100%",
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    textAlign: "left",
    minWidth: "750px",
  },
  th: {
    padding: "14px 12px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "13px",
    borderBottom: "1px solid #e2e8f0",
  },
  td: {
    padding: "15px 12px",
    fontSize: "13px",
    borderBottom: "1px solid #e2e8f0",
  },
  actionBadge: {
    padding: "5px 9px",
    borderRadius: "5px",
    fontSize: "11px",
    fontWeight: "700",
  },
  message: {
    textAlign: "center",
    padding: "35px",
    color: "#64748b",
  },
  error: {
    padding: "20px",
    color: "#dc2626",
    textAlign: "center",
  },
  retryButton: {
    marginLeft: "12px",
    padding: "8px 14px",
    cursor: "pointer",
  },
  footer: {
    color: "#64748b",
    fontSize: "12px",
    marginTop: "16px",
  },
};

export default ActivityLog;
