import { useEffect, useState } from "react";
import HandoverSummaries from "./HandoverSummaries.jsx";
import DoctorAppointments from "./DoctorAppointments.jsx";
import { apiRequest } from "../../services/api";
import "../../../App.css";

const defaultDoctor = {
  name: "Dr. Ananya Sharma",
  initials: "AS",
  specialization: "Cardiologist",
  doctorId: "DOC001",
  qualification: "MBBS, MD (Cardiology)",
  email: "ananya.sharma@example.com",
  phone: "+91 9876543210",
  hospital: "CareSync Healthcare",
  experience: 8,
};

const getInitials = (name = "Doctor") => {
  return name
    .replace(/^Dr\.?\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0].toUpperCase())
    .join("");
};

const getAppointmentColor = (index) => {
  const colors = ["blue", "purple", "green", "orange"];
  return colors[index % colors.length];
};

const formatAppointment = (item, index) => ({
  id: item._id,
  patientId: item.patientId || null,
  name: item.patientName,
  email: item.patientEmail || "",
  phone: item.patientPhone || "",
  initials: getInitials(item.patientName),
  type: item.type,
  time: item.appointmentTime,
  date: item.appointmentDate,
  status: item.status,
  color: getAppointmentColor(index),
  reason: item.reason || "",
});

export default function DoctorDashboard({ onLogout }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const greeting =
    currentDate.getHours() < 12
      ? "Good morning"
      : currentDate.getHours() < 17
      ? "Good afternoon"
      : "Good evening";

  const formattedDate = currentDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [doctor, setDoctor] = useState(defaultDoctor);
  const [doctorLoading, setDoctorLoading] = useState(true);
  const [doctorError, setDoctorError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Profile editing states
  const [isEditing, setIsEditing] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");

  const [activePage, setActivePage] = useState("Dashboard");
  const [search, setSearch] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Appointment states
  const [appointmentList, setAppointmentList] = useState([]);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [appointmentError, setAppointmentError] = useState("");
  const [updatingAppointmentId, setUpdatingAppointmentId] = useState(null);

  // Fetch doctor information from MongoDB
  useEffect(() => {
    let cancelled = false;

    const fetchDoctor = async () => {
      setDoctorLoading(true);
      setDoctorError("");

      try {
        const doctorData = await apiRequest("/doctors/profile");

        if (cancelled) return;

        setDoctor({
          name: doctorData.name || defaultDoctor.name,
          initials: getInitials(doctorData.name),
          specialization:
            doctorData.specialization || defaultDoctor.specialization,
          doctorId: doctorData._id || doctorData.id,
          qualification:
            doctorData.qualification || defaultDoctor.qualification,
          email: doctorData.email || defaultDoctor.email,
          phone: doctorData.phone || defaultDoctor.phone,
          hospital: doctorData.hospital || defaultDoctor.hospital,
          experience: doctorData.experience ?? 0,
        });
      } catch (error) {
        console.error("Doctor fetch error:", error);

        if (!cancelled) {
          setDoctorError(error.message);
        }
      } finally {
        if (!cancelled) {
          setDoctorLoading(false);
        }
      }
    };

    fetchDoctor();

    return () => {
      cancelled = true;
    };
  }, [retryCount]);

  // Fetch appointments after the MongoDB doctor ID is available
  useEffect(() => {
    if (!/^[0-9a-fA-F]{24}$/.test(doctor.doctorId)) {
      return;
    }

    let cancelled = false;

    const fetchAppointments = async () => {
      setAppointmentLoading(true);
      setAppointmentError("");

      try {
        const data = await apiRequest("/appointments/doctor");

        if (!Array.isArray(data)) {
          throw new Error("Invalid appointment data received.");
        }

        if (!cancelled) {
          setAppointmentList(data.map(formatAppointment));
        }
      } catch (error) {
        console.error("Appointment fetch error:", error);

        if (!cancelled) {
          setAppointmentError(error.message);
        }
      } finally {
        if (!cancelled) {
          setAppointmentLoading(false);
        }
      }
    };

    fetchAppointments();

    return () => {
      cancelled = true;
    };
  }, [doctor.doctorId]);

  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Appointments", icon: "▦" },
    { name: "Patient Details", icon: "♙" },
    { name: "Handover Summaries", icon: "▤" },
    { name: "My Profile", icon: "◉" },
  ];

  const filteredAppointments = appointmentList.filter((appointment) =>
    `${appointment.name} ${appointment.type} ${appointment.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Update appointment status in MongoDB
  const handleAppointmentStatusChange = async (id, newStatus) => {
    if (!id) {
      setAppointmentError("Invalid appointment ID.");
      return;
    }

    setUpdatingAppointmentId(id);
    setAppointmentError("");

    try {
      await apiRequest(`/appointments/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      // Update appointment list after successful database update
      setAppointmentList((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, status: newStatus }
            : appointment
        )
      );

      setSelectedAppointment((previous) =>
        previous?.id === id
          ? { ...previous, status: newStatus }
          : previous
      );
    } catch (error) {
      console.error("Appointment update error:", error);
      setAppointmentError(error.message);
    } finally {
      setUpdatingAppointmentId(null);
    }
  };

  // Open profile editing
  const handleEditProfile = () => {
    setProfileForm({
      name: doctor.name || "",
      email: doctor.email || "",
      phone: doctor.phone || "",
      specialization: doctor.specialization || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience ?? 0,
      hospital: doctor.hospital || "",
    });

    setProfileMessage("");
    setIsEditing(true);
  };

  // Save profile to MongoDB
  const handleProfileSave = async () => {
    if (!/^[0-9a-fA-F]{24}$/.test(doctor.doctorId)) {
      setProfileMessage(
        "A valid database doctor ID is required. Please refresh your profile."
      );
      return;
    }

    setSavingProfile(true);
    setProfileMessage("");

    try {
      const data = await apiRequest("/doctors/profile", {
        method: "PUT",
        body: JSON.stringify({
          ...profileForm,
          experience: Number(profileForm.experience),
        }),
      });

      const updatedDoctor = data.doctor;

      setDoctor({
        ...doctor,
        name: updatedDoctor.name,
        initials: getInitials(updatedDoctor.name),
        email: updatedDoctor.email,
        phone: updatedDoctor.phone,
        specialization: updatedDoctor.specialization,
        qualification: updatedDoctor.qualification,
        experience: updatedDoctor.experience,
        hospital: updatedDoctor.hospital,
      });

      setIsEditing(false);
      setProfileMessage("Profile updated successfully!");
    } catch (error) {
      setProfileMessage(error.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const uniquePatientCount = new Set(
  appointmentList
    .map(
      (item) =>
        item.patientId ||
        item.name?.trim().toLowerCase()
    )
    .filter(Boolean)
).size;

const stats = [
  {
    title: "Patients in Records",
    value: uniquePatientCount.toString(),
    change: "Based on appointment records",
    icon: "♙",
    color: "teal",
  },
  {
    title: "Total Appointments",
    value: appointmentList.length.toString(),
    change: "All scheduled visits",
    icon: "▦",
    color: "blue",
  },
  {
    title: "Completed Visits",
    value: appointmentList
      .filter((item) => item.status === "Completed")
      .length.toString()
      .padStart(2, "0"),
    change: "Completed appointments",
    icon: "✓",
    color: "green",
  },
  {
    title: "Pending Requests",
    value: appointmentList
      .filter((item) => item.status === "Waiting")
      .length.toString()
      .padStart(2, "0"),
    change: "Needs attention",
    icon: "◷",
    color: "orange",
  },
];



  return (
    <div className="doctor-app">
      <aside className="doctor-sidebar">
        <div className="doctor-brand">
          <div className="brand-symbol">✚</div>
          <div>
            <h2>CareSync</h2>
            <span>Smart Healthcare</span>
          </div>
        </div>

        <div className="doctor-role-label">DOCTOR PORTAL</div>

        <div className="doctor-profile-mini">
          <div className="doctor-avatar">{doctor.initials}</div>
          <div>
            <strong>{doctor.name}</strong>
            <span>{doctor.specialization}</span>
          </div>
        </div>

        <div className="doctor-nav-label">WORKSPACE</div>

        <nav className="doctor-nav">
          {menuItems.map((item) => (
            <button
              key={item.name}
              className={`doctor-nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item.name);
                setSelectedAppointment(null);
                setSearch("");
              }}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.name}</span>

              {item.name === "Appointments" && (
                <span className="nav-count">
                  {appointmentList.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="doctor-sidebar-bottom">
          <div className="sidebar-help-icon">?</div>
          <div>
            <strong>Need assistance?</strong>
            <span>Contact hospital support</span>
          </div>
        </div>

        <div className="doctor-sidebar-footer">
          <span className="online-dot" />
          CareSync Healthcare
        </div>
      </aside>

      <main className="doctor-main">
        <header className="doctor-topbar">
          <div className="breadcrumb">
            <span>CareSync</span>
            <span className="breadcrumb-separator">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
          <span className="topbar-date">
            <span>▦</span>{" "}
            {formattedDate}
          </span>

            <button
              className="notification-button"
              aria-label="Notifications"
              onClick={() =>
                window.alert("You are all caught up with notifications.")
              }
            >
              ♧
              <span className="notification-dot" />
            </button>

            <div className="topbar-avatar">{doctor.initials}</div>
            <button type="button" className="text-button" onClick={onLogout}>Logout</button>
          </div>
        </header>

        <div className="doctor-content">
          {selectedAppointment ? (
            <section className="detail-view">
              <button
                className="back-button"
                onClick={() => setSelectedAppointment(null)}
              >
                ← Back to {activePage}
              </button>

              <div className="page-heading">
                <div>
                  <p className="eyebrow">APPOINTMENT INFORMATION</p>
                  <h1>{selectedAppointment.name}</h1>
                  <p>Patient appointment details</p>
                </div>

                <span
                  className={`status-badge ${
                    selectedAppointment.status === "Waiting"
                      ? "waiting"
                      : selectedAppointment.status.toLowerCase()
                  }`}
                >
                  {selectedAppointment.status === "Waiting"
                    ? "Pending"
                    : selectedAppointment.status}
                </span>
              </div>

              <div className="detail-card">
                <div
                  className={`patient-avatar ${selectedAppointment.color}`}
                >
                  {selectedAppointment.initials}
                </div>

                <h2>{selectedAppointment.name}</h2>
                <p>{selectedAppointment.type}</p>

                {selectedAppointment.email && (
                  <div className="detail-row"><span>Patient email</span><strong>{selectedAppointment.email}</strong></div>
                )}
                {selectedAppointment.phone && (
                  <div className="detail-row"><span>Patient phone</span><strong>{selectedAppointment.phone}</strong></div>
                )}

                <div className="detail-row">
                  <span>Appointment time</span>
                  <strong>{selectedAppointment.time}</strong>
                </div>

                {selectedAppointment.date && (
                  <div className="detail-row">
                    <span>Appointment date</span>
                    <strong>
                      {new Date(
                        selectedAppointment.date
                      ).toLocaleDateString("en-IN")}
                    </strong>
                  </div>
                )}

                {selectedAppointment.reason && (
                  <div className="detail-row">
                    <span>Reason</span>
                    <strong>{selectedAppointment.reason}</strong>
                  </div>
                )}

                <div className="detail-row">
                  <span>Appointment status</span>
                  <strong>
                    {selectedAppointment.status === "Waiting"
                      ? "Pending"
                      : selectedAppointment.status}
                  </strong>
                </div>

                {selectedAppointment.status === "Waiting" && (
                  <div className="appointment-detail-actions">
                    <button
                      className="appointment-accept"
                      disabled={updatingAppointmentId === selectedAppointment.id}
                      onClick={() =>
                        handleAppointmentStatusChange(
                          selectedAppointment.id,
                          "Confirmed"
                        )
                      }
                    >
                      {updatingAppointmentId === selectedAppointment.id
                        ? "Updating..."
                        : "Accept Appointment"}
                    </button>

                    <button
                      className="appointment-reject"
                      disabled={updatingAppointmentId === selectedAppointment.id}
                      onClick={() =>
                        handleAppointmentStatusChange(
                          selectedAppointment.id,
                          "Rejected"
                        )
                      }
                    >
                      Reject Appointment
                    </button>
                  </div>
                )}

                {selectedAppointment.status === "Confirmed" && (
  <div className="appointment-detail-actions">
    <button
      className="appointment-accept"
      disabled={updatingAppointmentId === selectedAppointment.id}
      onClick={() =>
        handleAppointmentStatusChange(
          selectedAppointment.id,
          "Completed"
        )
      }
    >
      {updatingAppointmentId === selectedAppointment.id
        ? "Updating..."
        : "Mark as Completed"}
    </button>
  </div>
)}

                {appointmentError && (
                  <p className="demo-note">{appointmentError}</p>
                )}

                <p className="demo-note">
                  Appointment information is retrieved from the database.
                </p>
              </div>
            </section>
          ) : (
            <>
              <section className="page-heading">
                <div>
                  <p className="eyebrow">
                    {activePage === "My Profile"
                      ? "DOCTOR INFORMATION"
                      : "DOCTOR WORKSPACE"}
                  </p>

                  <h1>
                    {activePage === "Dashboard"
                      ? `${greeting}, ${doctor.name} 👋`
                      : activePage}
                  </h1>

                  <p>
                    {activePage === "Dashboard"
                      ? "Here's your healthcare overview for today."
                      : activePage === "My Profile"
                      ? "View your professional information."
                      : `Manage your ${activePage.toLowerCase()} in one place.`}
                  </p>
                </div>

                {activePage !== "My Profile" && (
                  <button
                    className="primary-button"
                    onClick={() => {
                      setActivePage("Appointments");
                      setSearch("");
                    }}
                  >
                    <span>＋</span> View Appointments
                  </button>
                )}
              </section>

              {activePage === "Dashboard" && (
                <>
                  <section className="welcome-banner">
                    <div className="welcome-copy">
                      <span className="welcome-tag">
                        YOUR DAILY OVERVIEW
                      </span>

                      <h2>Better care starts with you.</h2>

                      <p>
                        Stay organized, review your appointments, and
                        keep your patients' care on track.
                      </p>

                      <button
                        className="welcome-button"
                        onClick={() => setActivePage("Appointments")}
                      >
                        View today's schedule →
                      </button>
                    </div>

                    <div className="welcome-art" aria-hidden="true">
                      <div className="art-circle">
                        <span>✚</span>
                      </div>
                      <div className="art-plus plus-one">＋</div>
                      <div className="art-plus plus-two">✦</div>
                      <div className="art-caption">
                        CARE · TRUST · HEALTH
                      </div>
                    </div>
                  </section>

                  <section className="stats-grid">
                    {stats.map((stat) => (
                      <article className="stat-card" key={stat.title}>
                        <div className="stat-card-top">
                          <span>{stat.title}</span>
                          <div className={`stat-icon ${stat.color}`}>
                            {stat.icon}
                          </div>
                        </div>

                        <h2>{stat.value}</h2>
                        <p>{stat.change}</p>
                      </article>
                    ))}
                  </section>
                </>
              )}

              {/* MY PROFILE */}
              {activePage === "My Profile" && (
                <section className="panel doctor-profile-page">
                  <div className="panel-heading">
                    <div>
                      <h2>Doctor Profile</h2>
                      <p>Your professional details from MongoDB</p>
                    </div>

                    <button
                      type="button"
                      onClick={handleEditProfile}
                      disabled={isEditing || doctorLoading}
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="detail-card">
                    <div className="doctor-avatar">
                      {isEditing
                        ? getInitials(profileForm.name || "Doctor")
                        : doctor.initials}
                    </div>

                    {isEditing ? (
                      <>
                        {[
                          ["name", "Full Name", "text"],
                          ["email", "Email Address", "email"],
                          ["phone", "Phone Number", "text"],
                          ["specialization", "Specialization", "text"],
                          ["qualification", "Qualification", "text"],
                          ["experience", "Experience (Years)", "number"],
                          ["hospital", "Hospital", "text"],
                        ].map(([field, label, type]) => (
                          <div className="detail-row" key={field}>
                            <label>{label}</label>

                            <input
                              type={type}
                              min={type === "number" ? "0" : undefined}
                              value={profileForm[field] ?? ""}
                              onChange={(event) =>
                                setProfileForm({
                                  ...profileForm,
                                  [field]: event.target.value,
                                })
                              }
                            />
                          </div>
                        ))}

                        <div className="appointment-detail-actions">
                          <button
                            className="appointment-accept"
                            onClick={handleProfileSave}
                            disabled={savingProfile}
                          >
                            {savingProfile
                              ? "Saving..."
                              : "Save Changes"}
                          </button>

                          <button
                            className="appointment-reject"
                            onClick={() => {
                              setIsEditing(false);
                              setProfileMessage("");
                            }}
                            disabled={savingProfile}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h2>{doctor.name}</h2>
                        <p>{doctor.specialization}</p>

                        {[
                          ["Doctor ID", doctor.doctorId],
                          ["Qualification", doctor.qualification],
                          ["Experience", `${doctor.experience} years`],
                          ["Email address", doctor.email],
                          ["Phone number", doctor.phone],
                          ["Hospital", doctor.hospital],
                        ].map(([label, value]) => (
                          <div className="detail-row" key={label}>
                            <span>{label}</span>
                            <strong>{value || "Not provided"}</strong>
                          </div>
                        ))}
                      </>
                    )}

                    {profileMessage && (
                      <p className="demo-note">{profileMessage}</p>
                    )}

                    {doctorError && (
                      <div className="demo-note">
                        Database connection unavailable. Showing default
                        profile information.

                        <button
                          className="text-button"
                          onClick={() =>
                            setRetryCount((count) => count + 1)
                          }
                        >
                          Try Again
                        </button>
                      </div>
                    )}

                    {!doctorError && !profileMessage && !isEditing && (
                      <p className="demo-note">
                        Doctor profile information is loaded from MongoDB.
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* PATIENT DETAILS */}
              {activePage === "Patient Details" && (
                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Patient Directory</h2>
                      <p>
                        Find a patient from your appointment records.
                      </p>
                    </div>
                  </div>

                  <input
                    className="search-input"
                    placeholder="Search patients..."
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                  />

                  {appointmentError && (
                    <p className="demo-note">{appointmentError}</p>
                  )}

                  <div className="patient-directory">
                    {filteredAppointments.map((appointment) => (
                      <button
                        className="directory-row"
                        key={appointment.id}
                        onClick={() => setSelectedAppointment(appointment)}
                      >
                        <span
                          className={`patient-avatar ${appointment.color}`}
                        >
                          {appointment.initials}
                        </span>

                        <span className="directory-name">
                          <strong>{appointment.name}</strong>
                          <small>{appointment.type}</small>
                        </span>

                        <span>View details →</span>
                      </button>
                    ))}

                    {!appointmentLoading &&
                      filteredAppointments.length === 0 && (
                        <p className="empty-message">
                          No matching patients found.
                        </p>
                      )}
                  </div>
                </section>
              )}

              {/* HANDOVER SUMMARIES */}
              {activePage === "Handover Summaries" && (
                <HandoverSummaries doctorId={doctor.doctorId} />
              )}

              {/* APPOINTMENTS */}
              {activePage === "Appointments" && (
                <>
                  {appointmentLoading && (
                    <p className="demo-note">
                      Loading appointments from MongoDB...
                    </p>
                  )}

                  {appointmentError && (
                    <p className="demo-note">{appointmentError}</p>
                  )}

                  <DoctorAppointments
                    appointments={appointmentList}
                    onSelect={setSelectedAppointment}
                    onStatusChange={handleAppointmentStatusChange}
                  />
                </>
              )}

              {/* DASHBOARD BOTTOM */}
              {activePage === "Dashboard" && (
                <section className="dashboard-bottom">
                  <div className="panel appointments-panel">
                    <div className="panel-heading">
                      <div>
                        <h2>Today's Appointments</h2>
                        <p>Your upcoming patient consultations</p>
                      </div>

                      <button
                        className="text-button"
                        onClick={() => setActivePage("Appointments")}
                      >
                        View all →
                      </button>
                    </div>

                    {appointmentLoading ? (
                      <p className="empty-message">
                        Loading appointments...
                      </p>
                    ) : (
                      <AppointmentTable
                        appointments={appointmentList.slice(0, 3)}
                        onSelect={setSelectedAppointment}
                      />
                    )}
                  </div>

                  <div className="panel schedule-panel">
                    <div className="panel-heading">
                      <div>
                        <h2>Daily Schedule</h2>
                        <p>Consultation timeline</p>
                      </div>
                    </div>

                    <div className="schedule-summary">
                      <div>
                        <span className="schedule-big">
                          {appointmentList.length}
                        </span>
                        <span>Total visits</span>
                      </div>

                      <div>
                        <span className="schedule-big">
                          {
                            appointmentList.filter(
                              (item) =>
                                item.status === "Waiting" ||
                                item.status === "Confirmed"
                            ).length
                          }
                        </span>
                        <span>Upcoming</span>
                      </div>
                    </div>

                    <div className="schedule-progress">
                      <div
                        style={{
                          width: `${
                            appointmentList.length
                              ? (appointmentList.filter(
                                  (item) => item.status === "Completed"
                                ).length /
                                  appointmentList.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>

                    <p className="progress-caption">
                      {
                        appointmentList.filter(
                          (item) => item.status === "Completed"
                        ).length
                      }{" "}
                      of {appointmentList.length} appointments completed
                    </p>

                    <div className="schedule-tip">
                      <span>✦</span>
                      <div>
                        <strong>Care tip</strong>
                        <p>
                          Review patient history before each consultation.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </>
          )}
        </div>

        <footer className="doctor-footer">
          <span>© 2026 CareSync</span>
          <span>Smart Healthcare Platform</span>
          <span>
            <span className="online-dot" /> Doctor Portal
          </span>
        </footer>
      </main>
    </div>
  );
}

function AppointmentTable({ appointments, onSelect }) {
  if (appointments.length === 0) {
    return (
      <p className="empty-message">
        No matching appointments found.
      </p>
    );
  }

  return (
    <div className="appointment-table-wrap">
      <table className="appointment-table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Visit type</th>
            <th>Time</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {appointments.map((appointment) => (
            <tr key={appointment.id}>
              <td>
                <div className="patient-cell">
                  <span
                    className={`patient-avatar ${appointment.color}`}
                  >
                    {appointment.initials}
                  </span>

                  <strong>{appointment.name}</strong>
                </div>
              </td>

              <td>{appointment.type}</td>
              <td>{appointment.time}</td>

              <td>
                <span
                  className={`status-badge ${
                    appointment.status === "Waiting"
                      ? "waiting"
                      : appointment.status.toLowerCase()
                  }`}
                >
                  {appointment.status === "Waiting"
                    ? "Pending"
                    : appointment.status}
                </span>
              </td>

              <td>
                <button
                  className="view-button"
                  onClick={() => onSelect(appointment)}
                  aria-label={`View ${appointment.name}`}
                >
                  →
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
