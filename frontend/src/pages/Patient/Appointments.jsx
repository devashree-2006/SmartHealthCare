import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { apiRequest } from "../../services/api";

function localDate() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function Appointments() {
  const { t } = useTranslation();
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("10:00");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("10:00");

  const refresh = async () => {
    const [directory, mine] = await Promise.all([
      apiRequest("/appointments/doctors"),
      apiRequest("/appointments/mine"),
    ]);
    setDoctors(directory);
    setBookings(mine);
  };

  useEffect(() => {
    let active = true;
    Promise.all([
      apiRequest("/appointments/doctors"),
      apiRequest("/appointments/mine"),
    ])
      .then(([directory, mine]) => {
        if (active) {
          setDoctors(directory);
          setBookings(mine);
        }
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const handleBooking = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    if (date < localDate()) {
      setError("Choose a future date.");
      return;
    }
    setSaving(true);
    try {
      const result = await apiRequest("/appointments", {
        method: "POST",
        body: JSON.stringify({ doctorId, appointmentDate: date, appointmentTime: time, reason }),
      });
      setMessage(result.message);
      setDate("");
      setReason("");
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  };

  const cancel = async (id) => {
    if (!window.confirm("Cancel this appointment request?")) return;
    setError("");
    try {
      await apiRequest(`/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "Cancelled" }),
      });
      setMessage("Appointment cancelled.");
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const reschedule = async (id) => {
    setError("");
    try {
      await apiRequest(`/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ appointmentDate: editDate, appointmentTime: editTime }),
      });
      setEditingId(null);
      setMessage("Appointment request rescheduled.");
      await refresh();
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  const activeBookings = bookings.filter((item) => item.status !== "Cancelled");
  const statusLabel = { Waiting: "Awaiting doctor response", Confirmed: "Confirmed", Rejected: "Declined", Completed: "Completed", Cancelled: "Cancelled" };

  return (
    <div className="patient-dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">{t("patientServices")}</p>
          <h1>{t("appointments")}</h1>
          <p className="subtitle">Request a visit and follow your doctor's response here.</p>
        </div>
        <div className="patient-avatar">📅</div>
      </div>

      <section className="dashboard-section" id="booking-form">
        <div className="section-heading"><div><h2>Request an appointment</h2><p>Your doctor will confirm or decline the request.</p></div></div>
        <form className="booking-form" onSubmit={handleBooking}>
          <label>Doctor
            <select value={doctorId} onChange={(event) => setDoctorId(event.target.value)} required>
              <option value="">Choose a doctor</option>
              {doctors.map((doctor) => <option key={doctor._id} value={doctor._id}>{doctor.name} — {doctor.specialization}</option>)}
            </select>
          </label>
          <label>Date<input type="date" min={localDate()} value={date} onChange={(event) => setDate(event.target.value)} required /></label>
          <label>Preferred time
            <select value={time} onChange={(event) => setTime(event.target.value)}>
              <option value="10:00">10:00 AM</option><option value="11:30">11:30 AM</option><option value="14:00">02:00 PM</option><option value="15:30">03:30 PM</option>
            </select>
          </label>
          <label>Reason for visit<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Briefly describe what you need help with" rows="3" /></label>
          <button className="primary-button" disabled={saving || doctors.length === 0}>{saving ? "Sending request..." : "Send appointment request"}</button>
        </form>
        {doctors.length === 0 && !loading && <p className="demo-note">No doctor accounts are available yet.</p>}
        {message && <p className="form-message" role="status">{message}</p>}
        {error && <p className="form-message" role="alert">{error}</p>}
      </section>

      <section className="dashboard-section">
        <div className="section-heading"><div><h2>My appointments</h2><p>{activeBookings.length} active requests or visits</p></div></div>
        {loading ? <p>Loading appointments...</p> : bookings.length === 0 ? (
          <div className="empty-state"><h3>No appointments yet</h3><p>Your appointment requests and doctor responses will appear here.</p></div>
        ) : (
          <div className="appointment-list">
            {bookings.map((booking) => (
              <article className="appointment-card" key={booking._id}>
                <div className="doctor-avatar">🩺</div>
                <div className="appointment-info">
                  <h3>{booking.doctorName}</h3><p>{booking.specialization}</p>
                  <span>{booking.appointmentDate} · {booking.appointmentTime}</span>
                  <p>Reason: {booking.reason || "Consultation"}</p>
                  <span className={`status ${booking.status.toLowerCase()}`}>{statusLabel[booking.status] || booking.status}</span>
                  {editingId === booking._id && (
                    <div className="reschedule-form">
                      <label>New date<input type="date" min={localDate()} value={editDate} onChange={(event) => setEditDate(event.target.value)} required /></label>
                      <label>New time
                        <select value={editTime} onChange={(event) => setEditTime(event.target.value)}>
                          <option value="10:00">10:00 AM</option><option value="11:30">11:30 AM</option><option value="14:00">02:00 PM</option><option value="15:30">03:30 PM</option>
                        </select>
                      </label>
                      <button type="button" className="primary-button" onClick={() => reschedule(booking._id)}>Save changes</button>
                      <button type="button" className="secondary-button" onClick={() => setEditingId(null)}>Keep original</button>
                    </div>
                  )}
                </div>
                {["Waiting", "Confirmed"].includes(booking.status) && editingId !== booking._id && (
                  <div className="appointment-actions">
                    <button type="button" className="secondary-button" onClick={() => { setEditingId(booking._id); setEditDate(booking.appointmentDate); setEditTime(booking.appointmentTime); }}>Reschedule</button>
                    <button type="button" className="cancel-button" onClick={() => cancel(booking._id)}>Cancel</button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Appointments;
