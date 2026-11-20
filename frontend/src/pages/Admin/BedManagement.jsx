
import React, { useState } from "react";

const BedManagement = () => {
  const [beds] = useState([
    { id: "B101", ward: "General Ward", type: "Standard", status: "Available" },
    { id: "B102", ward: "General Ward", type: "Standard", status: "Occupied" },
    { id: "B201", ward: "ICU", type: "Intensive Care", status: "Occupied" },
    { id: "B202", ward: "ICU", type: "Intensive Care", status: "Available" },
    { id: "B301", ward: "Emergency", type: "Emergency", status: "Available" },
    { id: "B302", ward: "Emergency", type: "Emergency", status: "Occupied" },
  ]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredBeds = beds.filter((bed) => {
    const matchesSearch =
      bed.id.toLowerCase().includes(search.toLowerCase()) ||
      bed.ward.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || bed.status === filter;

    return matchesSearch && matchesFilter;
  });

  const available = beds.filter(
    (bed) => bed.status === "Available"
  ).length;

  const occupied = beds.filter(
    (bed) => bed.status === "Occupied"
  ).length;

  const styles = {
    page: {
      minHeight: "100vh",
      padding: "30px",
      background: "#f4f7fc",
      color: "#172033",
      fontFamily: "Arial, sans-serif",
      boxSizing: "border-box",
    },
    card: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: "14px",
      padding: "22px",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
      gap: "18px",
      margin: "24px 0",
    },
    toolbar: {
      display: "flex",
      flexWrap: "wrap",
      gap: "12px",
      marginBottom: "20px",
    },
    input: {
      padding: "12px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      fontSize: "14px",
      flex: "1",
      minWidth: "180px",
    },
    tableWrapper: {
      overflowX: "auto",
      background: "#ffffff",
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      textAlign: "left",
    },
    th: {
      padding: "15px",
      background: "#edf3ff",
      whiteSpace: "nowrap",
      fontSize: "13px",
    },
    td: {
      padding: "15px",
      borderTop: "1px solid #edf0f5",
      fontSize: "14px",
    },
  };

  return (
    <main style={styles.page}>
      <header>
        <p style={{ color: "#3568d4", fontWeight: "bold", fontSize: "12px" }}>
          ADMINISTRATION / HOSPITAL RESOURCES
        </p>
        <h1>Bed Management</h1>
        <p style={{ color: "#718096", lineHeight: 1.6 }}>
          View bed availability and occupancy across hospital wards.
        </p>
      </header>

      <section style={styles.grid}>
        <article style={styles.card}>
          <p style={{ color: "#718096" }}>Total Beds in Sample</p>
          <h2>{beds.length}</h2>
        </article>

        <article style={styles.card}>
          <p style={{ color: "#718096" }}>Available Beds</p>
          <h2 style={{ color: "#15803d" }}>{available}</h2>
        </article>

        <article style={styles.card}>
          <p style={{ color: "#718096" }}>Occupied Beds</p>
          <h2 style={{ color: "#b45309" }}>{occupied}</h2>
        </article>
      </section>

      <section style={{ ...styles.card, marginBottom: "22px" }}>
        <h2>Bed Occupancy</h2>
        <div
          style={{
            height: "12px",
            display: "flex",
            overflow: "hidden",
            borderRadius: "20px",
            background: "#e2e8f0",
          }}
        >
          <div
            style={{
              width: `${beds.length ? (occupied / beds.length) * 100 : 0}%`,
              background: "#f59e0b",
            }}
          />
        </div>
        <p style={{ color: "#718096", fontSize: "13px" }}>
          {beds.length
            ? Math.round((occupied / beds.length) * 100)
            : 0}
          % of sample beds are occupied.
        </p>
      </section>

      <section style={styles.card}>
        <h2>Bed Directory</h2>

        <div style={styles.toolbar}>
          <input
            style={styles.input}
            type="search"
            placeholder="Search bed ID or ward..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            style={styles.input}
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter beds by status"
          >
            <option value="All">All Beds</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Bed ID</th>
                <th style={styles.th}>Ward</th>
                <th style={styles.th}>Bed Type</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredBeds.map((bed) => (
                <tr key={bed.id}>
                  <td style={styles.td}>{bed.id}</td>
                  <td style={styles.td}>{bed.ward}</td>
                  <td style={styles.td}>{bed.type}</td>
                  <td style={styles.td}>
                    <span
                      style={{
                        padding: "6px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        color:
                          bed.status === "Available"
                            ? "#15803d"
                            : "#b45309",
                        background:
                          bed.status === "Available"
                            ? "#dcfce7"
                            : "#fef3c7",
                      }}
                    >
                      {bed.status}
                    </span>
                  </td>
                </tr>
              ))}

              {filteredBeds.length === 0 && (
                <tr>
                  <td colSpan="4" style={styles.td}>
                    No matching beds found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p style={{ color: "#94a3b8", fontSize: "12px", marginTop: "16px" }}>
          Demo data only. Live bed information will be connected to the
          existing backend later.
        </p>
      </section>
    </main>
  );
};

export default BedManagement;
