
import React, { useEffect, useState } from "react";
import {
  getBottleneckAlerts,
  createManualAlert,
  deleteManualAlert,
} from "../../services/api";

const BottleneckAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [severityFilter, setSeverityFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    department: "",
    severity: "Medium",
    description: "",
    status: "Active",
  });

  // Fetch live alerts from backend
  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const data = await getBottleneckAlerts();
      setAlerts(data);
      setError("");
    } catch (err) {
      console.error("Unable to load alerts:", err);
      setError("Unable to load alerts. Please check the backend connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  // Handle form inputs
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Create manual alert
  const handleCreateAlert = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");

      await createManualAlert(formData);

      setFormData({
        title: "",
        department: "",
        severity: "Medium",
        description: "",
        status: "Active",
      });

      setShowForm(false);
      setSuccessMessage("Manual alert created successfully!");

      await fetchAlerts();
    } catch (err) {
      setError(err.message || "Failed to create manual alert.");
    } finally {
      setSaving(false);
    }
  };

  // Delete manual alert only
  const handleDeleteAlert = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this manual alert?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccessMessage("");

      await deleteManualAlert(id);

      setAlerts((previous) =>
        previous.filter((alert) => alert.id !== id)
      );

      setSuccessMessage("Manual alert deleted successfully!");
    } catch (err) {
      setError(err.message || "Failed to delete manual alert.");
    } finally {
      setDeletingId(null);
    }
  };

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSeverity =
      severityFilter === "All" ||
      alert.severity === severityFilter;

    const matchesStatus =
      statusFilter === "All" ||
      alert.status === statusFilter;

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
    primaryButton: {
      padding: "11px 17px",
      background: "#2563eb",
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    secondaryButton: {
      padding: "11px 17px",
      background: "#ffffff",
      color: "#334155",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      fontSize: "14px",
      cursor: "pointer",
    },
    deleteButton: {
      padding: "8px 12px",
      background: "#fee2e2",
      color: "#b91c1c",
      border: "none",
      borderRadius: "7px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    input: {
      width: "100%",
      boxSizing: "border-box",
      padding: "11px 12px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      fontSize: "14px",
      marginTop: "7px",
    },
    formGroup: {
      marginBottom: "17px",
    },
    formLabel: {
      fontSize: "14px",
      fontWeight: "bold",
      color: "#334155",
    },
    message: {
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "15px",
      background: "#dcfce7",
      color: "#166534",
      fontSize: "14px",
    },
    errorMessage: {
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "15px",
      background: "#fee2e2",
      color: "#991b1b",
      fontSize: "14px",
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
      <div
        style={{
          color: "#64748b",
          fontSize: "12px",
          fontWeight: "bold",
        }}
      >
        ADMINISTRATION / MONITORING
      </div>

      <h1 style={styles.heading}>Bottleneck Alerts</h1>

      <p style={styles.subtitle}>
        Monitor potential hospital delays and resource pressure.
      </p>

      {/* Alert Statistics */}
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
        {/* Alert Centre Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
            marginBottom: "20px",
          }}
        >
          <h2 style={{ fontSize: "19px", margin: 0 }}>
            Alert Centre
          </h2>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              style={styles.secondaryButton}
              onClick={fetchAlerts}
              disabled={loading}
            >
              ↻ Refresh
            </button>

            <button
              style={styles.primaryButton}
              onClick={() => {
                setShowForm(!showForm);
                setError("");
                setSuccessMessage("");
              }}
            >
              + Create Alert
            </button>
          </div>
        </div>

        {successMessage && (
          <div style={styles.message}>{successMessage}</div>
        )}

        {error && (
          <div style={styles.errorMessage}>{error}</div>
        )}

        {/* Create Alert Form */}
        {showForm && (
          <form
            onSubmit={handleCreateAlert}
            style={{
              padding: "22px",
              border: "1px solid #cbd5e1",
              borderRadius: "10px",
              marginBottom: "22px",
              background: "#f8fafc",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: "18px" }}>
              Create Manual Alert
            </h3>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Alert Title *
              </label>
              <input
                style={styles.input}
                type="text"
                name="title"
                placeholder="Enter alert title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Department *
              </label>
              <input
                style={styles.input}
                type="text"
                name="department"
                placeholder="Enter department"
                value={formData.department}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Severity *
              </label>
              <select
                style={styles.input}
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                required
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Description *
              </label>
              <textarea
                style={{
                  ...styles.input,
                  minHeight: "90px",
                  resize: "vertical",
                }}
                name="description"
                placeholder="Describe the bottleneck or issue"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.formLabel}>
                Status
              </label>
              <select
                style={styles.input}
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="Active">Active</option>
                <option value="Monitoring">Monitoring</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                style={{
                  ...styles.primaryButton,
                  opacity: saving ? 0.6 : 1,
                }}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Alert"}
              </button>

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => setShowForm(false)}
                disabled={saving}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Filters */}
        <div style={styles.toolbar}>
          <select
            style={styles.select}
            value={severityFilter}
            onChange={(event) =>
              setSeverityFilter(event.target.value)
            }
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
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Monitoring">Monitoring</option>
          </select>
        </div>

        {/* Alert List */}
        {loading ? (
          <div style={styles.empty}>Loading alerts...</div>
        ) : filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <article
              key={alert.id || alert._id}
              style={styles.alertCard}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  flexWrap: "wrap",
                  gap: "12px",
                }}
              >
                <div style={{ flex: 1, minWidth: "200px" }}>
                  <h3
                    style={{
                      margin: "0 0 8px",
                      fontSize: "17px",
                    }}
                  >
                    {alert.title}
                  </h3>

                  <p
                    style={{
                      margin: "0 0 10px",
                      color: "#64748b",
                    }}
                  >
                    {alert.description}
                  </p>

                  <div
                    style={{
                      fontSize: "13px",
                      color: "#64748b",
                    }}
                  >
                    Department: {alert.department} · Reported:{" "}
                    {alert.time}
                  </div>

                  <div
                    style={{
                      marginTop: "10px",
                      fontSize: "12px",
                      fontWeight: "bold",
                      color:
                        alert.source === "Manual"
                          ? "#2563eb"
                          : "#64748b",
                    }}
                  >
                    {alert.source === "Manual"
                      ? "MANUAL ALERT"
                      : "AUTOMATIC ALERT"}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexWrap: "wrap",
                    alignItems: "center",
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
                        alert.status === "Active"
                          ? "#dcfce7"
                          : "#e2e8f0",
                      color:
                        alert.status === "Active"
                          ? "#166534"
                          : "#334155",
                    }}
                  >
                    {alert.status}
                  </span>

                  {alert.source === "Manual" && (
                    <button
                      style={{
                        ...styles.deleteButton,
                        opacity:
                          deletingId === alert.id ? 0.6 : 1,
                      }}
                      onClick={() => handleDeleteAlert(alert.id)}
                      disabled={deletingId === alert.id}
                    >
                      {deletingId === alert.id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div style={styles.empty}>
            No current bottleneck alerts. Hospital resources are not
            currently meeting the configured alert thresholds.
          </div>
        )}

        <p style={styles.note}>
          Automatic alerts are generated using live bed occupancy
          and staff duty records. Manual alerts are created by an
          administrator.
        </p>
      </section>
    </main>
  );
};

export default BottleneckAlerts;
