
import React, { useState } from "react";

function EmergencySupport() {
  const [emergencyType, setEmergencyType] = useState("Medical emergency");
  const [location, setLocation] = useState("");
  const [details, setDetails] = useState("");
  const [review, setReview] = useState(false);
  const [message, setMessage] = useState("");

  const handleReview = (event) => {
    event.preventDefault();
    setMessage("");

    if (!location.trim() || !details.trim()) {
      setMessage("Please enter your location and describe the situation.");
      return;
    }

    setReview(true);
  };

  const resetForm = () => {
    setEmergencyType("Medical emergency");
    setLocation("");
    setDetails("");
    setReview(false);
    setMessage("");
  };

  return (
    <div className="patient-dashboard emergency-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">PATIENT SAFETY</p>
          <h1>Emergency Support</h1>
          <p className="subtitle">
            Find emergency guidance and prepare an assistance request.
          </p>
        </div>
        <div className="patient-avatar">🚑</div>
      </div>

      <section className="emergency-alert-card">
        <div className="emergency-alert-icon">!</div>
        <div>
          <h2>Need urgent medical help?</h2>
          <p>
            If someone is in immediate danger, contact local emergency
            services or alert nearby hospital staff now.
          </p>
          <p className="emergency-disclaimer">
            This demo cannot call emergency services or notify hospital staff.
          </p>
        </div>
      </section>

      <section className="emergency-contact-grid">
        <article className="emergency-contact-card">
          <span>🚨</span>
          <h3>Emergency services</h3>
          <p>In India, dial 112 for emergency assistance.</p>
          <a className="emergency-call-button" href="tel:112">
            Call 112
          </a>
          <small>Use only when appropriate. Calling may depend on your device.</small>
        </article>

        <article className="emergency-contact-card">
          <span>🏥</span>
          <h3>Inside the hospital</h3>
          <p>Tell the nearest nurse, doctor, security guard, or reception staff.</p>
          <div className="emergency-info-label">
            Ask for immediate assistance
          </div>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Prepare an assistance request</h2>
            <p>Enter the details so they can be reviewed in this demo.</p>
          </div>
        </div>

        <form className="emergency-form" onSubmit={handleReview}>
          <label>
            Type of emergency
            <select
              value={emergencyType}
              onChange={(event) => setEmergencyType(event.target.value)}
            >
              <option>Medical emergency</option>
              <option>Accident or injury</option>
              <option>Breathing difficulty</option>
              <option>Mobility assistance</option>
              <option>Other urgent concern</option>
            </select>
          </label>

          <label>
            Your current location *
            <input
              type="text"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="e.g. Main building, Ground Floor, Room G-12"
              maxLength={150}
              required
            />
          </label>

          <label>
            Describe the situation *
            <textarea
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Briefly describe what assistance is needed..."
              rows={4}
              maxLength={1000}
              required
            />
          </label>

          {message && (
            <p className="feedback-error" role="alert">
              {message}
            </p>
          )}

          <button className="emergency-review-button" type="submit">
            Review request
          </button>
        </form>
      </section>

      {review && (
        <section className="emergency-review-card" aria-live="polite">
          <p className="eyebrow">REVIEW YOUR DETAILS</p>
          <h2>Assistance request summary</h2>

          <div className="emergency-review-row">
            <span>Emergency type</span>
            <strong>{emergencyType}</strong>
          </div>

          <div className="emergency-review-row">
            <span>Location</span>
            <strong>{location}</strong>
          </div>

          <div className="emergency-review-description">
            <span>Description</span>
            <p>{details}</p>
          </div>

          <p className="emergency-demo-warning">
            This is only a local preview. Your request has NOT been sent
            to hospital staff or emergency services.
          </p>

          <button
            className="secondary-button"
            type="button"
            onClick={() => setReview(false)}
          >
            Edit details
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={resetForm}
          >
            Clear form
          </button>
        </section>
      )}

      <p className="demo-note">
        Prototype only · No emergency alert is transmitted or stored.
        Never wait for this page if urgent help is needed.
      </p>
    </div>
  );
}

export default EmergencySupport;
