
import { useMemo, useState, useEffect } from "react";
import { apiRequest } from "../../services/api";

function HandoverSummaries({ doctorId }) {
  const [summaries, setSummaries] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedSummary, setSelectedSummary] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    patientName: "",
    condition: "",
    treatment: "",
    followUp: "",
    notes: "",
  });

  // Check whether the doctor ID is a valid MongoDB ID.
  const validDoctorId =
    typeof doctorId === "string" &&
    /^[a-f\d]{24}$/i.test(doctorId);

  // Fetch handover records from MongoDB.
  useEffect(() => {
    if (!validDoctorId) {
      return;
    }

    const fetchHandovers = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest("/handovers");
        setSummaries(data);
      } catch (err) {
        setError(err.message || "Unable to connect to the server.");
      } finally {
        setLoading(false);
      }
    };

    fetchHandovers();
  }, [doctorId, validDoctorId]);

  // Search handover records.
  const filteredSummaries = useMemo(() => {
    const term = search.toLowerCase().trim();

    return summaries.filter((summary) =>
      [
        summary.patientName,
        summary.condition,
        summary.treatment,
        summary.followUp,
        summary.notes,
      ].some((value) =>
        (value || "").toLowerCase().includes(term)
      )
    );
  }, [summaries, search]);

  // Update form fields.
  function updateField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Reset form.
  function resetForm() {
    setForm({
      patientName: "",
      condition: "",
      treatment: "",
      followUp: "",
      notes: "",
    });
  }

  // Create and save a handover in MongoDB.
  async function saveSummary(event) {
    event.preventDefault();

    if (!validDoctorId) {
      setError("Doctor information is not loaded. Please wait and try again.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const data = await apiRequest("/handovers", {
        method: "POST",
        body: JSON.stringify(form),
      });

      setSummaries((previous) => [
        data.handover,
        ...previous,
      ]);

      resetForm();
      setShowForm(false);
      setMessage("Handover summary saved successfully!");
    } catch (err) {
      setError(err.message || "Unable to save handover.");
    } finally {
      setSaving(false);
    }
  }

  // Delete a handover from MongoDB.
  async function deleteSummary(id) {
    if (!window.confirm("Delete this handover summary?")) {
      return;
    }

    setDeletingId(id);
    setError("");
    setMessage("");

    try {
      await apiRequest(`/handovers/${id}`, { method: "DELETE" });

      setSummaries((previous) =>
        previous.filter((summary) => summary._id !== id)
      );

      if (selectedSummary?._id === id) {
        setSelectedSummary(null);
      }

      setMessage("Handover summary deleted successfully!");
    } catch (err) {
      setError(err.message || "Unable to delete handover.");
    } finally {
      setDeletingId(null);
    }
  }

  // Format date.
  function formatDate(date) {
    if (!date) return "Date unavailable";

    return new Date(date).toLocaleString();
  }

  // Show loading while doctor information is being fetched.
  if (!validDoctorId) {
    return (
      <div className="handover-page">
        <div className="handover-card">
          <h2>Loading doctor information...</h2>
          <p>Please wait while your Doctor Profile is loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="handover-page">
      <div className="handover-heading">
        <div>
          <p className="handover-eyebrow">DOCTOR WORKSPACE</p>
          <h1>Handover Summaries</h1>
          <p className="handover-subtitle">
            Create and review clinical handover summaries.
          </p>
        </div>

        <button
          className="handover-primary-button"
          type="button"
          onClick={() => {
            setSelectedSummary(null);
            setShowForm((previous) => !previous);
            setMessage("");
            setError("");
          }}
        >
          {showForm ? "Cancel" : "+ New Handover"}
        </button>
      </div>

      <div className="handover-notice">
        <strong>Clinical handover workspace</strong>
        <span>
          Handover summaries are stored in MongoDB under the
          doctor's record. Use only authorized patient information.
        </span>
      </div>

      {message && (
        <div className="handover-notice">
          <strong>{message}</strong>
        </div>
      )}

      {error && (
        <div className="handover-notice">
          <strong>Error</strong>
          <span>{error}</span>
          <button
            type="button"
            className="handover-secondary-button"
            onClick={() => setError("")}
          >
            Dismiss
          </button>
        </div>
      )}

      {showForm && (
        <section className="handover-card">
          <h2>Create Handover Summary</h2>

          <form onSubmit={saveSummary}>
            <div className="handover-form-grid">
              <label>
                Patient name *
                <input
                  name="patientName"
                  value={form.patientName}
                  onChange={updateField}
                  placeholder="Enter patient name"
                  required
                />
              </label>

              <label>
                Current condition *
                <input
                  name="condition"
                  value={form.condition}
                  onChange={updateField}
                  placeholder="Brief condition"
                  required
                />
              </label>

              <label>
                Treatment provided
                <textarea
                  name="treatment"
                  value={form.treatment}
                  onChange={updateField}
                  placeholder="Treatment or care provided"
                  rows="3"
                />
              </label>

              <label>
                Follow-up instructions
                <textarea
                  name="followUp"
                  value={form.followUp}
                  onChange={updateField}
                  placeholder="Next steps or follow-up"
                  rows="3"
                />
              </label>

              <label className="handover-full-width">
                Additional notes
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={updateField}
                  placeholder="Other handover information"
                  rows="3"
                />
              </label>
            </div>

            <button
              className="handover-primary-button"
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Handover"}
            </button>
          </form>
        </section>
      )}

      <section className="handover-card">
        <div className="handover-list-heading">
          <div>
            <h2>Handover Records</h2>
            <p>Records retrieved from MongoDB.</p>
          </div>

          <span className="handover-count">
            {summaries.length}{" "}
            {summaries.length === 1 ? "record" : "records"}
          </span>
        </div>

        <input
          className="handover-search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by patient, condition or treatment..."
          aria-label="Search handover summaries"
        />

        {loading ? (
          <div className="handover-empty">
            <h3>Loading handover records...</h3>
            <p>Please wait.</p>
          </div>
        ) : filteredSummaries.length === 0 ? (
          <div className="handover-empty">
            <div className="handover-empty-icon">▤</div>

            <h3>
              {summaries.length === 0
                ? "No handover summaries yet"
                : "No matching summaries"}
            </h3>

            <p>
              {summaries.length === 0
                ? "Create a handover summary to see it listed here."
                : "Try another patient name or search term."}
            </p>

            {summaries.length === 0 && (
              <button
                className="handover-secondary-button"
                type="button"
                onClick={() => setShowForm(true)}
              >
                Create First Handover
              </button>
            )}
          </div>
        ) : (
          <div className="handover-record-list">
            {filteredSummaries.map((summary) => (
              <article
                className="handover-record"
                key={summary._id}
              >
                <div className="handover-record-avatar">
                  {(summary.patientName || "NA")
                    .split(" ")
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div className="handover-record-info">
                  <h3>{summary.patientName}</h3>
                  <p>{summary.condition}</p>
                  <span>{formatDate(summary.createdAt)}</span>
                </div>

                <div className="handover-record-actions">
                  <button
                    className="handover-secondary-button"
                    type="button"
                    onClick={() => setSelectedSummary(summary)}
                  >
                    View
                  </button>

                  <button
                    className="handover-delete-button"
                    type="button"
                    disabled={deletingId === summary._id}
                    onClick={() => deleteSummary(summary._id)}
                  >
                    {deletingId === summary._id
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {selectedSummary && (
        <div
          className="handover-modal-backdrop"
          onClick={() => setSelectedSummary(null)}
        >
          <section
            className="handover-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="handover-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="handover-modal-close"
              type="button"
              onClick={() => setSelectedSummary(null)}
              aria-label="Close summary"
            >
              ×
            </button>

            <p className="handover-eyebrow">HANDOVER DETAILS</p>

            <h2 id="handover-detail-title">
              {selectedSummary.patientName}
            </h2>

            <div className="handover-detail-row">
              <strong>Current condition</strong>
              <p>{selectedSummary.condition || "Not provided"}</p>
            </div>

            <div className="handover-detail-row">
              <strong>Treatment provided</strong>
              <p>{selectedSummary.treatment || "Not provided"}</p>
            </div>

            <div className="handover-detail-row">
              <strong>Follow-up instructions</strong>
              <p>{selectedSummary.followUp || "Not provided"}</p>
            </div>

            <div className="handover-detail-row">
              <strong>Additional notes</strong>
              <p>{selectedSummary.notes || "None"}</p>
            </div>

            <p className="handover-timestamp">
              Created: {formatDate(selectedSummary.createdAt)}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}

export default HandoverSummaries;
