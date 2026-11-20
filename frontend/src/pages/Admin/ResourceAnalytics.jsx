
import React, { useState } from "react";

const ResourceAnalytics = () => {
  const [period, setPeriod] = useState("Today");

  const resourceData = {
    Today: {
      patients: 124,
      doctors: 18,
      staff: 42,
      beds: 80,
      occupiedBeds: 58,
      appointments: 36,
    },
    Week: {
      patients: 846,
      doctors: 18,
      staff: 42,
      beds: 80,
      occupiedBeds: 63,
      appointments: 248,
    },
    Month: {
      patients: 3420,
      doctors: 18,
      staff: 42,
      beds: 80,
      occupiedBeds: 61,
      appointments: 986,
    },
  };

  const data = resourceData[period];
  const availableBeds = data.beds - data.occupiedBeds;
  const occupancyRate = Math.round(
    (data.occupiedBeds / data.beds) * 100
  );

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
    legend: {
      display: "flex",
      justifyContent: "space-between",
      gap: "12px",
      flexWrap: "wrap",
      fontSize: "14px",
      color: "#475569",
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
    },
  };

  return (
    <main style={styles.page}>
      <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "bold" }}>
        ADMINISTRATION / REPORTS
      </div>

      <div style={styles.toolbar}>
        <div>
          <h1 style={styles.heading}>Resource Analytics</h1>
          <p style={{ ...styles.subtitle, marginBottom: 0 }}>
            Review hospital resources and operational indicators.
          </p>
        </div>

        <select
          style={styles.select}
          value={period}
          onChange={(event) => setPeriod(event.target.value)}
          aria-label="Analytics period"
        >
          <option value="Today">Today</option>
          <option value="Week">This Week</option>
          <option value="Month">This Month</option>
        </select>
      </div>

      <section style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.label}>Patients</div>
          <div style={styles.value}>{data.patients.toLocaleString()}</div>
          <div style={{ color: "#64748b", fontSize: "13px", marginTop: "8px" }}>
            Selected period
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Doctors</div>
          <div style={styles.value}>{data.doctors}</div>
          <div style={{ color: "#64748b", fontSize: "13px", marginTop: "8px" }}>
            Sample staff count
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Appointments</div>
          <div style={styles.value}>{data.appointments.toLocaleString()}</div>
          <div style={{ color: "#64748b", fontSize: "13px", marginTop: "8px" }}>
            Selected period
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Hospital Staff</div>
          <div style={styles.value}>{data.staff}</div>
          <div style={{ color: "#64748b", fontSize: "13px", marginTop: "8px" }}>
            Sample staff count
          </div>
        </div>
      </section>

      <section style={styles.grid}>
        <div style={{ ...styles.card, gridColumn: "span 2" }}>
          <h2 style={styles.sectionTitle}>Bed Occupancy</h2>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "10px",
            }}
          >
            <span style={{ color: "#64748b", fontSize: "14px" }}>
              Current sample occupancy
            </span>
            <strong style={{ fontSize: "25px" }}>{occupancyRate}%</strong>
          </div>

          <div style={styles.progressBackground}>
            <div
              style={{
                width: `${occupancyRate}%`,
                height: "100%",
                background: "#2563eb",
                borderRadius: "20px",
                transition: "width 0.3s ease",
              }}
            />
          </div>

          <div style={styles.legend}>
            <span>Occupied: {data.occupiedBeds}</span>
            <span>Available: {availableBeds}</span>
            <span>Total: {data.beds}</span>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Resource Summary</h2>

          <div style={styles.metricRow}>
            <span>Total Beds</span>
            <strong>{data.beds}</strong>
          </div>

          <div style={styles.metricRow}>
            <span>Occupied Beds</span>
            <strong>{data.occupiedBeds}</strong>
          </div>

          <div style={styles.metricRow}>
            <span>Available Beds</span>
            <strong>{availableBeds}</strong>
          </div>

          <div style={{ ...styles.metricRow, borderBottom: "none" }}>
            <span>Occupancy Rate</span>
            <strong>{occupancyRate}%</strong>
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Operational Overview</h2>

        <div style={styles.metricRow}>
          <span>Patient count</span>
          <strong>{data.patients.toLocaleString()}</strong>
        </div>

        <div style={styles.metricRow}>
          <span>Appointments recorded</span>
          <strong>{data.appointments.toLocaleString()}</strong>
        </div>

        <div style={{ ...styles.metricRow, borderBottom: "none" }}>
          <span>Doctors listed</span>
          <strong>{data.doctors}</strong>
        </div>

        <p style={styles.note}>
          Demonstration data only. Analytics will use the existing backend
          and database when integration is completed.
        </p>
      </section>
    </main>
  );
};

export default ResourceAnalytics;
