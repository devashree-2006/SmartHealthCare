
import { useEffect, useState } from "react";
import {
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff,
} from "../../services/adminApi";

const initialForm = {
  staffId: "",
  password: "",
  name: "",
  role: "Nurse",
  department: "",
  shift: "Morning",
  status: "Off Duty",
};

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const data = await getStaff();
      setStaff(data);
      setError("");
    } catch (err) {
      setError("Unable to load staff: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Loading remote records is an external synchronization effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStaff();
  }, []);

  const handleAdd = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleEdit = (person) => {
    setForm({
      staffId: person.staffId,
      password: "",
      name: person.name,
      role: person.role,
      department: person.department,
      shift: person.shift,
      status: person.status,
    });
    setEditingId(person._id);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (editingId) {
        await updateStaff(editingId, form);
        setSuccess("Staff member updated successfully.");
      } else {
        await addStaff(form);
        setSuccess("Staff member added successfully.");
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);
      await fetchStaff();
    } catch (err) {
      setError(err.message || "Unable to save staff member.");
    }
  };

  const handleDelete = async (id, staffId) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete staff member ${staffId}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteStaff(id);
      setSuccess("Staff member deleted successfully.");
      await fetchStaff();
    } catch (err) {
      setError(err.message || "Unable to delete staff member.");
    }
  };

  const filteredStaff = staff.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(search.toLowerCase()) ||
      person.staffId.toLowerCase().includes(search.toLowerCase()) ||
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
  padding: "55px 30px 30px",
  background: "#f5f7fb",
      minHeight: "100vh",
      fontFamily: "Arial, sans-serif",
      color: "#1e293b",
      boxSizing: "border-box",
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
      border: "1px solid #e2e8f0",
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
      width: "100%",
      boxSizing: "border-box",
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
      minWidth: "850px",
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
    button: {
      padding: "10px 15px",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "bold",
    },
    primaryButton: {
      background: "#3568d4",
      color: "#ffffff",
    },
    editButton: {
      background: "#e0eaff",
      color: "#2454ad",
      marginRight: "6px",
    },
    deleteButton: {
      background: "#fee2e2",
      color: "#b91c1c",
    },
    formGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "16px",
      marginTop: "18px",
    },
    formLabel: {
      display: "block",
      fontSize: "13px",
      fontWeight: "bold",
      marginBottom: "7px",
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

      {error && (
        <p
          role="alert"
          style={{
            color: "#b91c1c",
            background: "#fee2e2",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          {error}
        </p>
      )}

      {success && (
        <p
          role="status"
          style={{
            color: "#15803d",
            background: "#dcfce7",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          {success}
        </p>
      )}

      <section style={styles.stats}>
        <div style={styles.card}>
          <div style={styles.label}>Total Staff Members</div>
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

      {showForm && (
        <section style={{ ...styles.card, marginBottom: "22px" }}>
          <h2>{editingId ? "Edit Staff Member" : "Add New Staff Member"}</h2>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid}>
              <div>
                <label style={styles.formLabel}>Staff ID</label>
                <input
                  style={styles.input}
                  name="staffId"
                  value={form.staffId}
                  onChange={handleChange}
                  placeholder="e.g. STF-101"
                  required
                />
              </div>

              <div>
                <label style={styles.formLabel}>Full Name</label>
                <input
                  style={styles.input}
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter staff name"
                  required
                />
              </div>

              <div>
                <label style={styles.formLabel}>{editingId ? "New Password (optional)" : "Sign-in Password"}</label>
                <input
                  style={styles.input}
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder={editingId ? "Leave blank to keep current password" : "At least 8 characters"}
                  minLength={8}
                  required={!editingId}
                />
              </div>

              <div>
                <label style={styles.formLabel}>Role</label>
                <select
                  style={styles.input}
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                >
                  <option value="Nurse">Nurse</option>
                  <option value="Technician">Technician</option>
                  <option value="Receptionist">Receptionist</option>
                </select>
              </div>

              <div>
                <label style={styles.formLabel}>Department</label>
                <input
                  style={styles.input}
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. ICU"
                  required
                />
              </div>

              <div>
                <label style={styles.formLabel}>Shift</label>
                <select
                  style={styles.input}
                  name="shift"
                  value={form.shift}
                  onChange={handleChange}
                >
                  <option value="Morning">Morning</option>
                  <option value="Evening">Evening</option>
                  <option value="Night">Night</option>
                </select>
              </div>

              <div>
                <label style={styles.formLabel}>Duty Status</label>
                <select
                  style={styles.input}
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="On Duty">On Duty</option>
                  <option value="Off Duty">Off Duty</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
              <button
                type="submit"
                style={{ ...styles.button, ...styles.primaryButton }}
              >
                {editingId ? "Update Staff" : "Save Staff"}
              </button>

              <button
                type="button"
                style={{
                  ...styles.button,
                  background: "#e2e8f0",
                  color: "#172033",
                }}
                onClick={() => {
                  setShowForm(false);
                  setForm(initialForm);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section style={styles.card}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <h2 style={{ fontSize: "19px", marginTop: 0 }}>
            Staff Directory
          </h2>

          <button
            style={{ ...styles.button, ...styles.primaryButton }}
            onClick={handleAdd}
          >
            + Add Staff
          </button>
        </div>

        <div style={styles.toolbar}>
          <input
            style={{ ...styles.input, flex: 1, minWidth: "180px" }}
            type="search"
            placeholder="Search by name, ID, or department..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <select
            style={styles.select}
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            aria-label="Filter staff by role"
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
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td style={styles.td} colSpan="7">
                    Loading staff...
                  </td>
                </tr>
              ) : filteredStaff.length > 0 ? (
                filteredStaff.map((person) => (
                  <tr key={person._id}>
                    <td style={styles.td}>{person.staffId}</td>
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
                    <td style={styles.td}>
                      <button
                        style={{ ...styles.button, ...styles.editButton }}
                        onClick={() => handleEdit(person)}
                      >
                        Edit
                      </button>

                      <button
                        style={{ ...styles.button, ...styles.deleteButton }}
                        onClick={() =>
                          handleDelete(person._id, person.staffId)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td style={styles.td} colSpan="7">
                    No staff members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p style={{ color: "#64748b", fontSize: "13px", marginTop: "18px" }}>
          Staff information is loaded from the hospital database.
        </p>
      </section>
    </main>
  );
};

export default StaffManagement;
