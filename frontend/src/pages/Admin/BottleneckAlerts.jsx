
import React, { useState } from "react";

const BottleneckAlerts = () => {
  const [alerts] = useState([
    {
      id: 1,
      title: "High ICU Occupancy",
      department: "ICU",
      severity: "Critical",
      description: "ICU beds are nearing full capacity.",
      time: "10:30 AM",
      status: "Active",
    },
    {
      id: 2,
      title: "Emergency Waiting Time",
      department: "Emergency",
      severity: "High",
      description: "Patient waiting time is above the expected level.",
      time: "10:15 AM",
      status: "Active",
    },
    {
      id: 3,
      title: "Staff Shortage",
      department: "General Ward",
      severity: "Medium",
      description: "Additional nursing staff may be required.",
      time: "09:45 AM",
      status: "Active",
    },
    {
      id: 4,
      title: "Laboratory Processing Delay",
      department: "Laboratory",
      severity: "Low",
      description: "Some test reports are taking longer than expected.",
      time: "09:20 AM",
      status: "Monitoring",
    },
  ]);

  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity =
      severityFilter === "All" || alert.severity === severityFilter;

    const matchesStatus =
      statusFilter === "All" || alert.status === statusFilter;

    return matchesSeverity && matchesStatus;
  });

  const criticalCount = alerts.filter(
    (alert) => alert.severity === "Critical"
  ).length;

  const activeCount = alerts.filter(
    (alert) => alert.status === "Active"
  ).length;

  const styles = {
    page: {
      padding: "30px",
      minHeight: "100vh",
      background: "#f5f7fb",
      fontFamily: "Arial, sans-serif",
      color: "#1e293b",
    },
    heading: {
      fontSize: "28px",
      margin: "8px 0",
    },
    subtitle: {
      color: "#64748b",
      marginBottom: "25px",
    },
    stats: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "18px",
      marginBottom: "25px",
    },
    card: {
      background: "#ffffff",
      padding: "22px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)",
    },
    label: {
      color: "#64748b",
      fontSize: "14px",
    },
    value: {
      fontSize: "28px",
      fontWeight: "bold",
      marginTop: "10px",
    },
    toolbar: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      marginBottom: "20px",
    },
    select: {
      padding: "11px 13px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      background: "#ffffff",
      fontSize: "14px",
      minWidth: "160px",
    },
    alertCard: {
      padding: "20px",
      border: "1px solid #e2e8f0",
      borderRadius: "10px",
      marginBottom: "15px",
      background: "#ffffff",
    },
    badge: {
      display: "inline-block",
      padding: "5px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
    },
    empty: {
      padding: "25px",
      textAlign: "center",
      color: "#64748b",
    },
    note: {
      marginTop: "20px",
      color: "#64748b",
      fontSize: "13px",
    },
  };

  const severityColors = {
    Critical: { background: "#fee2e2", color: "#991b1b" },
    High: { background: "#ffedd5", color: "#9a3412" },
    Medium: { background: "#fef3c7", color: "#92400e" },
    Low: { background: "#dbeafe", color: "#1e40af" },
  };

  return (
    <main style={styles.page}>
      <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "bold" }}>
        ADMINISTRATION / MONITORING
      </div>

      <h1 style={styles.heading}>Bottleneck Alerts</h1>

      <p style={styles.subtitle}>
        Monitor potential hospital delays and resource pressure.
      </p>

      <section style={styles.stats}>
        <div style={styles.card}>
          <div style={styles.label}>Total Alerts</div>
          <div style={styles.value}>{alerts.length}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Critical Alerts</div>
          <div style={{ ...styles.value, color: "#dc2626" }}>
            {criticalCount}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Active Alerts</div>
          <div style={{ ...styles.value, color: "#ea580c" }}>
            {activeCount}
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={{ fontSize: "19px", marginTop: 0 }}>
          Alert Centre
        </h2>

        <div style={styles.toolbar}>
          <select
            style={styles.select}
            value={severityFilter}
            onChange={(event) => setSeverityFilter(event.target.value)}
          >
            <option value="All">All Severity Levels</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <select
            style={styles.select}
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Monitoring">Monitoring</option>
          </select>
        </div>

        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <article key={alert.id} style={styles.alertCard}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 8px", fontSize: "17px" }}>
                    {alert.title}
                  </h3>

                  <p style={{ margin: "0 0 10px", color: "#64748b" }}>
                    {alert.description}
                  </p>

                  <div style={{ fontSize: "13px", color: "#64748b" }}>
                    Department: {alert.department} · Reported: {alert.time}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      ...styles.badge,
                      ...severityColors[alert.severity],
                    }}
                  >
                    {alert.severity}
                  </span>

                  <span
                    style={{
                      ...styles.badge,
                      background:
                        alert.status === "Active" ? "#dcfce7" : "#e2e8f0",
                      color:
                        alert.status === "Active" ? "#166534" : "#334155",
                    }}
                  >
                    {alert.status}
                  </span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div style={styles.empty}>
            No alerts match the selected filters.
          </div>
        )}

        <p style={styles.note}>
          Demo alerts only. Live alerts and predictions will be connected to
          the existing backend during integration.
        </p>
      </section>
    </main>
  );
};

export default BottleneckAlerts;
