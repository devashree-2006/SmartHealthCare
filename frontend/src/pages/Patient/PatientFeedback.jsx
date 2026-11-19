
import React, { useState } from "react";

const categories = [
  "Overall Experience",
  "Doctor",
  "Nursing Staff",
  "Hospital Facilities",
  "Appointment Service",
  "Other",
];

function PatientFeedback() {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [category, setCategory] = useState("Overall Experience");
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submissions, setSubmissions] = useState([]);

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (rating === 0) {
      setError("Please select a star rating before submitting.");
      return;
    }

    if (!comment.trim()) {
      setError("Please enter a short comment about your experience.");
      return;
    }

    const newFeedback = {
      id: Date.now(),
      rating,
      category,
      comment: comment.trim(),
      date: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
    };

    setSubmissions((previous) => [newFeedback, ...previous]);
    setMessage("Thank you! Your feedback has been submitted successfully.");
    setRating(0);
    setHoverRating(0);
    setCategory("Overall Experience");
    setComment("");
  };

  const averageRating = submissions.length
    ? (
        submissions.reduce((total, item) => total + item.rating, 0) /
        submissions.length
      ).toFixed(1)
    : "—";

  return (
    <div className="patient-dashboard patient-feedback-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">YOUR VOICE MATTERS</p>
          <h1>Patient Feedback</h1>
          <p className="subtitle">
            Share your experience and help us improve patient care.
          </p>
        </div>
        <div className="patient-avatar">💬</div>
      </div>

      <section className="welcome-card">
        <div>
          <p className="welcome-label">WE ARE LISTENING</p>
          <h2>Your experience matters to us.</h2>
          <p>
            Tell us what went well and where we can do better.
          </p>
        </div>
        <span className="welcome-icon">♡</span>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon">💬</div>
          <p>Feedback submitted</p>
          <h2>{submissions.length}</h2>
          <span>This session</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon">⭐</div>
          <p>Average rating</p>
          <h2>{averageRating}</h2>
          <span>Out of 5 stars</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon">✓</div>
          <p>Categories</p>
          <h2>{categories.length}</h2>
          <span>Ways to share feedback</span>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Tell us about your visit</h2>
            <p>Fields marked with * are required.</p>
          </div>
        </div>

        <form className="feedback-form" onSubmit={handleSubmit}>
          <fieldset className="feedback-fieldset">
            <legend>How would you rate your experience? *</legend>

            <div className="star-rating" role="group" aria-label="Rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star ${
                    star <= (hoverRating || rating) ? "selected" : ""
                  }`}
                  onClick={() => {
                    setRating(star);
                    setError("");
                  }}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onFocus={() => setHoverRating(star)}
                  onBlur={() => setHoverRating(0)}
                  aria-label={`${star} ${star === 1 ? "star" : "stars"}`}
                  aria-pressed={rating === star}
                >
                  ★
                </button>
              ))}
            </div>

            <p className="rating-hint">
              {rating === 0
                ? "Select a rating from 1 to 5 stars."
                : [
                    "",
                    "Poor",
                    "Fair",
                    "Good",
                    "Very good",
                    "Excellent",
                  ][rating]}
            </p>
          </fieldset>

          <label className="feedback-label">
            Feedback category *
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="feedback-label">
            Your comments *
            <textarea
              rows="5"
              maxLength={1000}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Tell us about your experience..."
              required
            />
            <span className="comment-counter">
              {comment.length}/1000 characters
            </span>
          </label>

          {error && (
            <p className="feedback-error" role="alert">
              {error}
            </p>
          )}

          {message && (
            <p className="feedback-success" role="status">
              {message}
            </p>
          )}

          <button className="primary-button" type="submit">
            Submit feedback
          </button>
        </form>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Your submitted feedback</h2>
            <p>Feedback submitted during this session appears here.</p>
          </div>
        </div>

        {submissions.length === 0 ? (
          <div className="empty-state">
            <span>💬</span>
            <h3>No feedback submitted yet</h3>
            <p>Your submitted feedback will appear here.</p>
          </div>
        ) : (
          <div className="feedback-list">
            {submissions.map((item) => (
              <article className="feedback-card" key={item.id}>
                <div className="feedback-card-header">
                  <div>
                    <span className="feedback-category-tag">
                      {item.category}
                    </span>
                    <div
                      className="feedback-stars"
                      aria-label={`${item.rating} out of 5 stars`}
                    >
                      {"★".repeat(item.rating)}
                      <span className="unfilled-stars">
                        {"★".repeat(5 - item.rating)}
                      </span>
                    </div>
                  </div>
                  <span className="feedback-date">{item.date}</span>
                </div>
                <p>{item.comment}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="demo-note">
        Demo only · Feedback is held in temporary page state and resets
        when you reload. Do not enter sensitive medical or personal details.
      </p>
    </div>
  );
}

export default PatientFeedback;
