
import React, { useEffect, useState } from "react";
import { getBeds, getStaff } from "../../services/api";

const ResourceAnalytics = () => {
  const [period, setPeriod] = useState("Today");
  const [beds, setBeds] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchResources = async () => {
    try {
      setError("");
      setLoading(true);

      const [bedData, staffData] = await Promise.all([
        getBeds(),
        getStaff(),
      ]);

      setBeds(bedData);
      setStaff(staffData);
    } catch (err) {
      console.error("Unable to load resource analytics:", err);
      setError("Unable to load resource data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const getPeriodStart = () => {
    const now = new Date();
    const start = new Date(now);

    if (period === "Today") {
      start.setHours(0, 0, 0, 0);
    } else if (period === "Week") {
      start.setHours(0, 0, 0, 0);
      const day = start.getDay();
      start.setDate(start.getDate() - (day === 0 ? 6 : day - 1));
    } else {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    }

    return start;
  };

  const periodStart = getPeriodStart();

  const bedsAddedInPeriod = beds.filter(
    (bed) => bed.createdAt && new Date(bed.createdAt) >= periodStart
  ).length;

  const staffAddedInPeriod = staff.filter(
    (member) =>
      member.createdAt &&
      new Date(member.createdAt) >= periodStart
  ).length;

  const totalBeds = beds.length;
  const occupiedBeds = beds.filter(
    (bed) => bed.status === "Occupied"
  ).length;
  const availableBeds = beds.filter(
    (bed) => bed.status === "Available"
  ).length;

  const totalStaff = staff.length;
  const onDutyStaff = staff.filter(
    (member) => member.status === "On Duty"
  ).length;
  const offDutyStaff = staff.filter(
    (member) => member.status === "Off Duty"
  ).length;

  const occupancyRate = totalBeds
    ? Math.round((occupiedBeds / totalBeds) * 100)
    : 0;

  const staffDutyRate = totalStaff
    ? Math.round((onDutyStaff / totalStaff) * 100)
    : 0;

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
    toolbar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexWrap: "wrap",
      gap: "15px",
      marginBottom: "25px",
    },
    select: {
      padding: "11px 14px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      background: "#ffffff",
      fontSize: "14px",
    },
    button: {
      padding: "11px 16px",
      border: "none",
      borderRadius: "8px",
      background: "#2563eb",
      color: "#ffffff",
      cursor: "pointer",
      fontWeight: "600",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
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
      fontSize: "29px",
      fontWeight: "bold",
      marginTop: "12px",
    },
    sectionTitle: {
      fontSize: "19px",
      marginTop: 0,
      marginBottom: "20px",
    },
    progressBackground: {
      height: "12px",
      background: "#e2e8f0",
      borderRadius: "20px",
      overflow: "hidden",
      margin: "15px 0",
    },
    metricRow: {
      display: "flex",
      justifyContent: "space-between",
      gap: "15px",
      padding: "15px 0",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
    },
    note: {
      marginTop: "20px",
      color: "#64748b",
      fontSize: "13px",
      lineHeight: "1.6",
    },
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <h1 style={styles.heading}>Resource Analytics</h1>
        <p>Loading resource data...</p>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "bold" }}>
        ADMINISTRATION / REPORTS
      </div>

      <div style={styles.toolbar}>
        <div>
          <h1 style={styles.heading}>Resource Analytics</h1>
          <p style={{ ...styles.subtitle, marginBottom: 0 }}>
            Monitor current hospital beds and staff resources.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select
            style={styles.select}
            value={period}
            onChange={(event) => setPeriod(event.target.value)}
            aria-label="Record creation period"
          >
            <option value="Today">Today</option>
            <option value="Week">This Week</option>
            <option value="Month">This Month</option>
          </select>

          <button
            type="button"
            style={styles.button}
            onClick={fetchResources}
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div
          role="alert"
          style={{
            background: "#fee2e2",
            color: "#991b1b",
            padding: "14px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
          <button
            type="button"
            onClick={fetchResources}
            style={{ marginLeft: "12px", cursor: "pointer" }}
          >
            Retry
          </button>
        </div>
      )}

      <section style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.label}>Total Beds</div>
          <div style={styles.value}>{totalBeds}</div>
          <div style={styles.note}>Current database records</div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Occupied Beds</div>
          <div style={styles.value}>{occupiedBeds}</div>
          <div style={styles.note}>Currently marked occupied</div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Available Beds</div>
          <div style={styles.value}>{availableBeds}</div>
          <div style={styles.note}>Currently marked available</div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Total Staff</div>
          <div style={styles.value}>{totalStaff}</div>
          <div style={styles.note}>Current database records</div>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Bed Occupancy</h2>
          <strong style={{ fontSize: "25px" }}>{occupancyRate}%</strong>

          <div style={styles.progressBackground}>
            <div
              style={{
                width: `${occupancyRate}%`,
                height: "100%",
                background: "#2563eb",
                borderRadius: "20px",
              }}
            />
          </div>

          <p style={styles.note}>
            {occupiedBeds} occupied out of {totalBeds} total beds.
          </p>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Staff Duty Overview</h2>
          <strong style={{ fontSize: "25px" }}>{staffDutyRate}%</strong>

          <div style={styles.progressBackground}>
            <div
              style={{
                width: `${staffDutyRate}%`,
                height: "100%",
                background: "#16a34a",
                borderRadius: "20px",
              }}
            />
          </div>

          <div style={styles.metricRow}>
            <span>On Duty</span>
            <strong>{onDutyStaff}</strong>
          </div>

          <div style={{ ...styles.metricRow, borderBottom: "none" }}>
            <span>Off Duty</span>
            <strong>{offDutyStaff}</strong>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Resource Summary</h2>

        <div style={styles.metricRow}>
          <span>Beds added during {period}</span>
          <strong>{bedsAddedInPeriod}</strong>
        </div>

        <div style={styles.metricRow}>
          <span>Staff added during {period}</span>
          <strong>{staffAddedInPeriod}</strong>
        </div>

        <div style={styles.metricRow}>
          <span>Total beds</span>
          <strong>{totalBeds}</strong>
        </div>

        <div style={styles.metricRow}>
          <span>Total staff</span>
          <strong>{totalStaff}</strong>
        </div>

        <p style={styles.note}>
          The period selector filters records by their creation date.
          Current bed occupancy and staff duty figures always show the
          latest database status, not historical snapshots.
          Patient, doctor and appointment statistics are not included
          because those modules are outside this Admin module's current
          database integration.
        </p>
      </section>
    </main>
  );
};

export default ResourceAnalytics;
