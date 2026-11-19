
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const appointments = [
  {
    id: 1,
    doctor: "Dr. Ananya Rao",
    department: "Cardiology",
    date: "28 Oct 2026",
    time: "10:00 AM",
    status: "confirmed",
  },
  {
    id: 2,
    doctor: "Dr. Rahul Sharma",
    department: "General Medicine",
    date: "30 Oct 2026",
    time: "11:30 AM",
    status: "upcoming",
  },
];

const medicalRecords = [
  {
    id: 1,
    title: "completeBloodCount",
    type: "bloodTest",
    date: "12 Oct 2026",
    icon: "🩸",
  },
  {
    id: 2,
    title: "generalHealthCheckup",
    type: "consultation",
    date: "08 Oct 2026",
    icon: "🩺",
  },
  {
    id: 3,
    title: "medicationInstructions",
    type: "prescription",
    date: "05 Oct 2026",
    icon: "💊",
  },
];

const quickLinks = [
  {
    title: "bookAppointment",
    description: "findDoctor",
    icon: "📅",
    path: "/appointments",
  },
  {
    title: "medicalRecords",
    description: "viewReports",
    icon: "📋",
    path: "/records",
  },
  {
    title: "hospitalNavigation",
    description: "findDepartments",
    icon: "📍",
    path: "/navigation",
  },
  {
    title: "patientFeedback",
    description: "shareExperience",
    icon: "💬",
    path: "/feedback",
  },
];

function PatientDashboard() {
  const { t } = useTranslation();

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">{t("patientPortal").toUpperCase()}</p>
          <h1>{t("welcomeBack")} 👋</h1>
          <p className="subtitle">{t("dashboardSubtitle")}</p>
        </div>

        <div className="patient-avatar">👤</div>
      </div>

      <section className="welcome-card">
        <div>
          <p className="welcome-label">{t("yourHealthMatters")}</p>
          <h2>{t("stayInformed")}</h2>
          <p>{t("dashboardWelcomeText")}</p>
          <Link to="/appointments" className="dashboard-cta">
            {t("bookAppointment")} →
          </Link>
        </div>
        <span className="welcome-icon">💙</span>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon">📅</div>
          <p>{t("upcomingAppointments")}</p>
          <h2>{appointments.length}</h2>
          <span>{t("scheduledVisits")}</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon">📋</div>
          <p>{t("medicalRecords")}</p>
          <h2>{medicalRecords.length}</h2>
          <span>{t("sampleRecordsAvailable")}</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon">🩺</div>
          <p>{t("healthcareServices")}</p>
          <h2>{quickLinks.length}</h2>
          <span>{t("availablePortalSections")}</span>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>{t("upcomingAppointments")}</h2>
            <p>{t("trackScheduledVisits")}</p>
          </div>
          <Link to="/appointments" className="text-link">
            {t("viewAll")} →
          </Link>
        </div>

        <div className="appointment-list">
          {appointments.map((appointment) => (
            <article className="appointment-card" key={appointment.id}>
              <div className="doctor-avatar">🩺</div>

              <div className="appointment-info">
                <h3>{appointment.doctor}</h3>
                <p>{t(appointment.department === "Cardiology"
                  ? "cardiology"
                  : "generalMedicine")}</p>
                <span>
                  {appointment.date} · {appointment.time}
                </span>
              </div>

              <span className={`status ${appointment.status}`}>
                {t(appointment.status)}
              </span>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>{t("recentMedicalRecords")}</h2>
            <p>{t("latestHealthDocuments")}</p>
          </div>
          <Link to="/records" className="text-link">
            {t("viewRecords")} →
          </Link>
        </div>

        <div className="records-list">
          {medicalRecords.map((record) => (
            <article className="record-item" key={record.id}>
              <div className="record-icon">{record.icon}</div>

              <div className="record-details">
                <h3>{t(record.title)}</h3>
                <p>{t(record.type)}</p>
              </div>

              <span className="record-date">{record.date}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>{t("quickAccess")}</h2>
            <p>{t("quickAccessSubtitle")}</p>
          </div>
        </div>

        <div className="quick-access-grid">
          {quickLinks.map((item) => (
            <Link
              to={item.path}
              className="quick-card"
              key={item.path}
            >
              <span className="quick-card-icon">{item.icon}</span>
              <h3>{t(item.title)}</h3>
              <p>{t(item.description)}</p>
              <span className="quick-card-arrow">
                {t("explore")} →
              </span>
            </Link>
          ))}
        </div>
      </section>

      <p className="demo-note">{t("demoNotice")}</p>
    </div>
  );
}

export default PatientDashboard;
