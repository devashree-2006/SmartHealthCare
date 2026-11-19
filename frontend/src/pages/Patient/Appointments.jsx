
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const doctors = [
  { id: 1, name: "Dr. Ananya Rao", department: "cardiology" },
  { id: 2, name: "Dr. Rahul Sharma", department: "generalMedicine" },
  { id: 3, name: "Dr. Meera Nair", department: "dermatology" },
];

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

const initialBookings = [
  {
    id: 101,
    doctorId: 1,
    doctor: "Dr. Ananya Rao",
    department: "cardiology",
    date: "2026-10-28",
    time: "10:00",
    reason: "regularConsultation",
    status: "Confirmed",
  },
  {
    id: 102,
    doctorId: 2,
    doctor: "Dr. Rahul Sharma",
    department: "generalMedicine",
    date: "2026-10-30",
    time: "11:30",
    reason: "generalHealthCheckup",
    status: "Confirmed",
  },
];

function Appointments() {
  const { t } = useTranslation();

  const [doctor, setDoctor] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState(initialBookings);
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("10:00");

  const handleBooking = (event) => {
    event.preventDefault();

    if (!doctor || !date) {
      setMessage(t("selectDoctorAndDate"));
      return;
    }

    if (date < getLocalDate()) {
      setMessage(t("selectFutureDate"));
      return;
    }

    const selectedDoctor = doctors.find(
      (item) => item.id === Number(doctor)
    );

    const newBooking = {
      id: Date.now(),
      doctorId: selectedDoctor.id,
      doctor: selectedDoctor.name,
      department: selectedDoctor.department,
      date,
      time,
      reason: reason.trim() || t("generalConsultation"),
      status: "Confirmed",
    };

    setBookings((previous) => [...previous, newBooking]);
    setMessage(t("appointmentBooked"));

    setDoctor("");
    setDate("");
    setTime("10:00");
    setReason("");
  };

  const cancelBooking = (id) => {
    if (!window.confirm(t("confirmCancelAppointment"))) return;

    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id
          ? { ...booking, status: "Cancelled" }
          : booking
      )
    );

    setEditingId(null);
    setMessage(t("appointmentCancelled"));
  };

  const startReschedule = (booking) => {
    setEditingId(booking.id);
    setEditDate(booking.date);
    setEditTime(booking.time);
    setMessage("");
  };

  const saveReschedule = (id) => {
    if (!editDate || editDate < getLocalDate()) {
      setMessage(t("chooseFutureDate"));
      return;
    }

    setBookings((previous) =>
      previous.map((booking) =>
        booking.id === id
          ? {
              ...booking,
              date: editDate,
              time: editTime,
              status: "Rescheduled",
            }
          : booking
      )
    );

    setEditingId(null);
    setMessage(t("appointmentRescheduled"));
  };

  const activeBookings = bookings.filter(
    (booking) => booking.status !== "Cancelled"
  );

  const statusKey = (status) => {
    const keys = {
      Confirmed: "confirmed",
      Cancelled: "cancelled",
      Rescheduled: "rescheduled",
    };
    return keys[status] || status;
  };

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">{t("patientServices")}</p>
          <h1>{t("appointments")}</h1>
          <p className="subtitle">{t("manageVisitsSubtitle")}</p>
        </div>
        <div className="patient-avatar">📅</div>
      </div>

      <section className="welcome-card">
        <div>
          <p className="welcome-label">{t("yourHealthMatters")}</p>
          <h2>{t("manageAppointmentsHeading")}</h2>
          <p>{t("scheduleVisitsText")}</p>
        </div>
        <span className="welcome-icon">♡</span>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon">📅</div>
          <p>{t("activeAppointments")}</p>
          <h2>{activeBookings.length}</h2>
          <span>{t("notCancelled")}</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon">🩺</div>
          <p>{t("availableDoctors")}</p>
          <h2>{doctors.length}</h2>
          <span>{t("sampleDirectory")}</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon">✓</div>
          <p>{t("cancelled")}</p>
          <h2>
            {bookings.filter((booking) => booking.status === "Cancelled").length}
          </h2>
          <span>{t("appointmentHistory")}</span>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>{t("availableDoctors")}</h2>
            <p>{t("selectDoctorToBook")}</p>
          </div>
        </div>

        <div className="quick-access-grid">
          {doctors.map((item) => (
            <article className="quick-card" key={item.id}>
              <span className="quick-card-icon">🩺</span>
              <h3>{item.name}</h3>
              <p>{t(item.department)}</p>
              <button
                className="primary-button"
                type="button"
                onClick={() => {
                  setDoctor(String(item.id));
                  setMessage("");
                  document
                    .getElementById("booking-form")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {t("selectDoctor")}
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-section" id="booking-form">
        <div className="section-heading">
          <div>
            <h2>{t("bookAppointment")}</h2>
            <p>{t("enterPreferredDateTime")}</p>
          </div>
        </div>

        <form className="booking-form" onSubmit={handleBooking}>
          <label>
            {t("selectDoctor")}
            <select
              value={doctor}
              onChange={(event) => setDoctor(event.target.value)}
              required
            >
              <option value="">{t("chooseDoctor")}</option>
              {doctors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} — {t(item.department)}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t("appointmentDate")}
            <input
              type="date"
              value={date}
              min={getLocalDate()}
              onChange={(event) => setDate(event.target.value)}
              required
            />
          </label>

          <label>
            {t("preferredTime")}
            <select
              value={time}
              onChange={(event) => setTime(event.target.value)}
            >
              <option value="10:00">10:00 AM</option>
              <option value="11:30">11:30 AM</option>
              <option value="14:00">02:00 PM</option>
              <option value="15:30">03:30 PM</option>
            </select>
          </label>

          <label>
            {t("reasonForVisit")}
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder={t("reasonPlaceholder")}
              rows="3"
            />
          </label>

          <button className="primary-button" type="submit">
            {t("confirmAppointment")}
          </button>
        </form>

        {message && (
          <p className="form-message" role="status">
            {message}
          </p>
        )}
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>{t("myAppointments")}</h2>
            <p>{t("manageBookingsSubtitle")}</p>
          </div>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <span>📅</span>
            <h3>{t("noAppointmentsYet")}</h3>
            <p>{t("bookingsAppearHere")}</p>
          </div>
        ) : (
          <div className="appointment-list">
            {bookings.map((booking) => (
              <article className="appointment-card" key={booking.id}>
                <div className="doctor-avatar">🩺</div>

                <div className="appointment-info">
                  <h3>{booking.doctor}</h3>
                  <p>{t(booking.department)}</p>
                  <span>{booking.date} · {booking.time}</span>
                  <p>
                    {t("reason")}:{" "}
                    {booking.reason === "regularConsultation" ||
                    booking.reason === "generalHealthCheckup"
                      ? t(booking.reason)
                      : booking.reason}
                  </p>

                  <span
                    className={`status ${
                      booking.status === "Cancelled"
                        ? "cancelled"
                        : "confirmed"
                    }`}
                  >
                    {t(statusKey(booking.status))}
                  </span>

                  {editingId === booking.id && (
                    <div className="reschedule-form">
                      <label>
                        {t("newDate")}
                        <input
                          type="date"
                          min={getLocalDate()}
                          value={editDate}
                          onChange={(event) => setEditDate(event.target.value)}
                          required
                        />
                      </label>

                      <label>
                        {t("newTime")}
                        <select
                          value={editTime}
                          onChange={(event) => setEditTime(event.target.value)}
                        >
                          <option value="10:00">10:00 AM</option>
                          <option value="11:30">11:30 AM</option>
                          <option value="14:00">02:00 PM</option>
                          <option value="15:30">03:30 PM</option>
                        </select>
                      </label>

                      <button
                        className="primary-button"
                        type="button"
                        onClick={() => saveReschedule(booking.id)}
                      >
                        {t("saveChanges")}
                      </button>

                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => setEditingId(null)}
                      >
                        {t("keepOriginal")}
                      </button>
                    </div>
                  )}
                </div>

                {booking.status !== "Cancelled" &&
                  editingId !== booking.id && (
                    <div className="appointment-actions">
                      <button
                        className="secondary-button"
                        type="button"
                        onClick={() => startReschedule(booking)}
                      >
                        {t("reschedule")}
                      </button>

                      <button
                        className="cancel-button"
                        type="button"
                        onClick={() => cancelBooking(booking.id)}
                      >
                        {t("cancel")}
                      </button>
                    </div>
                  )}
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="demo-note">{t("appointmentDemoNotice")}</p>
    </div>
  );
}

export default Appointments;
