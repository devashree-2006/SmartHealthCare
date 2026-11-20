
import React, { useState } from "react";

const StaffManagement = () => {
  const [staff] = useState([
    {
      id: "ST101",
      name: "Aarav Sharma",
      role: "Nurse",
      department: "General Ward",
      shift: "Morning",
      status: "On Duty",
    },
    {
      id: "ST102",
      name: "Diya Patel",
      role: "Technician",
      department: "Laboratory",
      shift: "Evening",
      status: "Off Duty",
    },
    {
      id: "ST103",
      name: "Rohan Kumar",
      role: "Nurse",
      department: "ICU",
      shift: "Night",
      status: "On Duty",
    },
    {
      id: "ST104",
      name: "Ananya Rao",
      role: "Receptionist",
      department: "Reception",
      shift: "Morning",
      status: "On Duty",
    },
    {
      id: "ST105",
      name: "Ishaan Mehta",
      role: "Technician",
      department: "Radiology",
      shift: "Evening",
      status: "Off Duty",
    },
  ]);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filteredStaff = staff.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.id.toLowerCase().includes(search.toLowerCase()) ||
      person.department.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" || person.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const onDuty = staff.filter(
    (person) => person.status === "On Duty"
  ).length;

  const offDuty = staff.filter(
    (person) => person.status === "Off Duty"
  ).length;

  const styles = {
    page: {
      padding: "30px",
      background: "#f5f7fb",
      minHeight: "100vh",
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
      gap: "12px",
      flexWrap: "wrap",
      marginBottom: "20px",
    },
    input: {
      padding: "11px 13px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      fontSize: "14px",
      flex: "1",
      minWidth: "180px",
    },
    select: {
      padding: "11px 13px",
      border: "1px solid #cbd5e1",
      borderRadius: "8px",
      background: "#ffffff",
      fontSize: "14px",
      minWidth: "150px",
    },
    tableWrapper: {
      overflowX: "auto",
    },
    table: {
      width: "100%",
      borderCollapse: "collapse",
      minWidth: "700px",
    },
    th: {
      textAlign: "left",
      padding: "14px",
      background: "#f8fafc",
      color: "#475569",
      fontSize: "13px",
      borderBottom: "1px solid #e2e8f0",
    },
    td: {
      padding: "15px 14px",
      borderBottom: "1px solid #e2e8f0",
      fontSize: "14px",
    },
    badge: {
      padding: "5px 10px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "bold",
      display: "inline-block",
    },
    note: {
      marginTop: "18px",
      color: "#64748b",
      fontSize: "13px",
    },
  };

  return (
    <main style={styles.page}>
      <div style={{ color: "#64748b", fontSize: "12px", fontWeight: "bold" }}>
        ADMINISTRATION / PEOPLE
      </div>

      <h1 style={styles.heading}>Staff Management</h1>

      <p style={styles.subtitle}>
        View staff information, departments, shifts, and duty status.
      </p>

      <section style={styles.stats}>
        <div style={styles.card}>
          <div style={styles.label}>Total Staff</div>
          <div style={styles.value}>{staff.length}</div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>On Duty</div>
          <div style={{ ...styles.value, color: "#16a34a" }}>
            {onDuty}
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.label}>Off Duty</div>
          <div style={{ ...styles.value, color: "#d97706" }}>
            {offDuty}
          </div>
        </div>
      </section>

      <section style={styles.card}>
        <h2 style={{ fontSize: "19px", marginTop: 0 }}>
          Staff Directory
        </h2>

        <div style={styles.toolbar}>
          <input
            style={styles.input}
            type="text"
            placeholder="Search by name, ID, or department..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            style={styles.select}
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="All">All Roles</option>
            <option value="Nurse">Nurse</option>
            <option value="Technician">Technician</option>
            <option value="Receptionist">Receptionist</option>
          </select>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Staff ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Shift</th>
                <th style={styles.th}>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaff.length > 0 ? (
                filteredStaff.map((person) => (
                  <tr key={person.id}>
                    <td style={styles.td}>{person.id}</td>
                    <td style={styles.td}>{person.name}</td>
                    <td style={styles.td}>{person.role}</td>
                    <td style={styles.td}>{person.department}</td>
                    <td style={styles.td}>{person.shift}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          ...styles.badge,
                          background:
                            person.status === "On Duty"
                              ? "#dcfce7"
                              : "#fef3c7",
                          color:
                            person.status === "On Duty"
                              ? "#166534"
                              : "#92400e",
                        }}
                      >
                        {person.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    style={styles.td}
                    colSpan="6"
                  >
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p style={styles.note}>
          Demo data only. Staff records will be connected to the existing
          backend during integration.
        </p>
      </section>
    </main>
  );
};

export default StaffManagement;
