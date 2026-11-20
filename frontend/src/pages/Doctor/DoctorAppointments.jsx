
import React, { useMemo, useState } from "react";

export default function DoctorAppointments({
  appointments = [],
  onSelect,
  onStatusChange,
  loading = false,
  error = "",
}) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Pending", "Confirmed", "Completed", "Rejected"];

  const counts = {
    All: appointments.length,
    Pending: appointments.filter((item) => item.status === "Waiting").length,
    Confirmed: appointments.filter((item) => item.status === "Confirmed").length,
    Completed: appointments.filter((item) => item.status === "Completed").length,
    Rejected: appointments.filter((item) => item.status === "Rejected").length,
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter((appointment) => {
      const matchesSearch = `
        ${appointment.name}
        ${appointment.type}
        ${appointment.status}
      `
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesFilter =
        activeFilter === "All" ||
        (activeFilter === "Pending"
          ? appointment.status === "Waiting"
          : appointment.status === activeFilter);

      return matchesSearch && matchesFilter;
    });
  }, [appointments, search, activeFilter]);

  const getStatusClass = (status) =>
    status === "Waiting" ? "waiting" : status.toLowerCase();

  const displayStatus = (status) =>
    status === "Waiting" ? "Pending" : status;

  return (
    <div className="doctor-appointments">
      <div className="appointment-page-heading">
        <div>
          <p className="eyebrow">DOCTOR WORKSPACE</p>
          <h2>Appointment Management</h2>
          <p>Review patient requests and manage your consultation schedule.</p>
        </div>

        <div className="appointment-total">
          <span>{appointments.length}</span>
          <small>Total appointments</small>
        </div>
      </div>

      <div className="appointment-stats">
        <div className="appointment-stat-card">
          <span className="appointment-stat-icon blue">▦</span>
          <div><p>Total Appointments</p><h3>{counts.All}</h3></div>
        </div>

        <div className="appointment-stat-card">
          <span className="appointment-stat-icon orange">◷</span>
          <div><p>Pending Requests</p><h3>{counts.Pending}</h3></div>
        </div>

        <div className="appointment-stat-card">
          <span className="appointment-stat-icon green">✓</span>
          <div><p>Confirmed</p><h3>{counts.Confirmed}</h3></div>
        </div>

        <div className="appointment-stat-card">
          <span className="appointment-stat-icon purple">▤</span>
          <div><p>Completed</p><h3>{counts.Completed}</h3></div>
        </div>
      </div>

      <section className="panel appointment-management-panel">
        <div className="panel-heading">
          <div>
            <h2>Appointment Schedule</h2>
            <p>Manage and review your patient consultations.</p>
          </div>
          <span className="table-count">
            {filteredAppointments.length} appointments
          </span>
        </div>

        <input
          className="search-input"
          type="text"
          placeholder="Search patient, visit type or status..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <div className="appointment-filters">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`appointment-filter ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
              <span>{counts[filter]}</span>
            </button>
          ))}
        </div>

        {loading ? (
          <p className="empty-message">Loading appointments from MongoDB...</p>
        ) : error ? (
          <p className="empty-message">{error}</p>
        ) : filteredAppointments.length > 0 ? (
          <div className="appointment-table-wrap">
            <table className="appointment-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Visit Type</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div className="patient-cell">
                        <span className={`patient-avatar ${appointment.color}`}>
                          {appointment.initials}
                        </span>
                        <strong>{appointment.name}</strong>
                      </div>
                    </td>

                    <td>{appointment.type}</td>
                    <td>{appointment.time}</td>

                    <td>
                      <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                        {displayStatus(appointment.status)}
                      </span>
                    </td>

                    <td>
                      <div className="appointment-actions">
                        {appointment.status === "Waiting" && (
                          <>
                            <button
                              className="appointment-accept"
                              onClick={() => onStatusChange(appointment.id, "Confirmed")}
                            >
                              Accept
                            </button>

                            <button
                              className="appointment-reject"
                              onClick={() => onStatusChange(appointment.id, "Rejected")}
                            >
                              Reject
                            </button>
                          </>
                        )}

                        <button
                          className="view-button"
                          onClick={() => onSelect(appointment)}
                          aria-label={`View ${appointment.name}`}
                        >
                          →
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-icon">▦</div>
            <h3>No appointments found</h3>
            <p>
              {appointments.length === 0
                ? "No appointments have been booked for this doctor yet."
                : "No appointments match your search or selected status."}
            </p>
          </div>
        )}
      </section>

      <p className="demo-note">
  Appointment records are retrieved from MongoDB.
  Status changes are saved to the database.
</p>
    </div>
  );
}
