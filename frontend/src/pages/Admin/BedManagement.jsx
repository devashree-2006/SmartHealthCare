
import React, { useEffect, useState } from "react";
import {
  getBeds,
  addBed,
  updateBed,
  deleteBed,
} from "../../services/adminApi";

const initialForm = {
  bedNumber: "",
  ward: "",
  type: "General",
  status: "Available",
};

const BedManagement = () => {
  const [beds, setBeds] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchBeds = async () => {
    try {
      setLoading(true);
      const data = await getBeds();
      setBeds(data);
      setError("");
    } catch (err) {
      setError("Unable to load beds: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBeds();
  }, []);

  const handleAdd = () => {
    setForm(initialForm);
    setEditingId(null);
    setError("");
    setSuccess("");
    setShowForm(true);
  };

  const handleEdit = (bed) => {
    setForm({
      bedNumber: bed.bedNumber,
      ward: bed.ward,
      type: bed.type,
      status: bed.status,
    });
    setEditingId(bed._id);
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
        await updateBed(editingId, form);
        setSuccess("Bed updated successfully.");
      } else {
        await addBed(form);
        setSuccess("Bed added successfully.");
      }

      setShowForm(false);
      setForm(initialForm);
      setEditingId(null);
      await fetchBeds();
    } catch (err) {
      setError(err.message || "Unable to save bed.");
    }
  };

  const handleDelete = async (id, bedNumber) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete bed ${bedNumber}?`
    );

    if (!confirmed) return;

    setError("");
    setSuccess("");

    try {
      await deleteBed(id);
      setSuccess("Bed deleted successfully.");
      await fetchBeds();
    } catch (err) {
      setError(err.message || "Unable to delete bed.");
    }
  };

  const filteredBeds = beds.filter((bed) => {
    const query = search.toLowerCase();

    const matchesSearch =
      bed.bedNumber.toLowerCase().includes(query) ||
      bed.ward.toLowerCase().includes(query);

    const matchesFilter =
      filter === "All" || bed.status === filter;

    return matchesSearch && matchesFilter;
  });

  const available = beds.filter(
    (bed) => bed.status === "Available"
  ).length;

  const occupied = beds.filter(
    (bed) => bed.status === "Occupied"
  ).length;

  const occupancyRate = beds.length
    ? Math.round((occupied / beds.length) * 100)
    : 0;

  const closeForm = () => {
    setShowForm(false);
    setForm(initialForm);
    setEditingId(null);
    setError("");
  };

  return (
    <main className="bed-page">
      <div className="bed-page-header">
        <div>
          <p className="bed-breadcrumb">
            ADMINISTRATION / HOSPITAL RESOURCES
          </p>
          <h1>Bed Management</h1>
          <p className="bed-subtitle">
            Monitor bed availability and occupancy across hospital wards.
          </p>
        </div>

        <button
          type="button"
          className="bed-primary-button"
          onClick={handleAdd}
        >
          <span>+</span> Add New Bed
        </button>
      </div>

      {error && (
        <div className="bed-message bed-error" role="alert">
          <strong>Attention</strong>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bed-message bed-success" role="status">
          <strong>Success</strong>
          <span>{success}</span>
        </div>
      )}

      <section className="bed-stats-grid">
        <article className="bed-stat-card">
          <div>
            <p>Total Beds</p>
            <h2>{beds.length}</h2>
            <span>Registered hospital beds</span>
          </div>
          <div className="bed-stat-icon blue-icon">▤</div>
        </article>

        <article className="bed-stat-card">
          <div>
            <p>Available Beds</p>
            <h2 className="available-number">{available}</h2>
            <span>Ready for allocation</span>
          </div>
          <div className="bed-stat-icon green-icon">✓</div>
        </article>

        <article className="bed-stat-card">
          <div>
            <p>Occupied Beds</p>
            <h2 className="occupied-number">{occupied}</h2>
            <span>Currently occupied</span>
          </div>
          <div className="bed-stat-icon orange-icon">▣</div>
        </article>
      </section>

      <section className="bed-occupancy-panel">
        <div className="bed-occupancy-heading">
          <div>
            <h2>Bed Occupancy Overview</h2>
            <p>Current utilization of registered hospital beds</p>
          </div>
          <strong>{occupancyRate}%</strong>
        </div>

        <div
          className="bed-occupancy-track"
          role="progressbar"
          aria-label="Bed occupancy"
          aria-valuenow={occupancyRate}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="bed-occupancy-fill"
            style={{ width: `${occupancyRate}%` }}
          />
        </div>

        <div className="bed-occupancy-footer">
          <span>{occupied} occupied</span>
          <span>{available} available</span>
        </div>
      </section>

      {showForm && (
        <section className="bed-form-panel">
          <div className="bed-section-heading">
            <div>
              <h2>{editingId ? "Edit Bed Details" : "Register New Bed"}</h2>
              <p>
                {editingId
                  ? "Update the selected bed information."
                  : "Enter the details to add a bed to the hospital."}
              </p>
            </div>
            <button
              type="button"
              className="bed-close-button"
              onClick={closeForm}
              aria-label="Close form"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bed-form-grid">
              <div className="bed-form-field">
                <label htmlFor="bedNumber">Bed Number</label>
                <input
                  id="bedNumber"
                  name="bedNumber"
                  value={form.bedNumber}
                  onChange={handleChange}
                  placeholder="e.g. BED-101"
                  required
                />
              </div>

              <div className="bed-form-field">
                <label htmlFor="ward">Ward</label>
                <input
                  id="ward"
                  name="ward"
                  value={form.ward}
                  onChange={handleChange}
                  placeholder="e.g. General Ward"
                  required
                />
              </div>

              <div className="bed-form-field">
                <label htmlFor="type">Bed Type</label>
                <select
                  id="type"
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                >
                  <option value="General">General</option>
                  <option value="ICU">ICU</option>
                  <option value="Private">Private</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>

              <div className="bed-form-field">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                </select>
              </div>
            </div>

            <div className="bed-form-actions">
              <button type="submit" className="bed-primary-button">
                {editingId ? "Update Bed" : "Save Bed"}
              </button>
              <button
                type="button"
                className="bed-secondary-button"
                onClick={closeForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="bed-directory-panel">
        <div className="bed-section-heading">
          <div>
            <h2>Bed Directory</h2>
            <p>View and manage all registered hospital beds.</p>
          </div>
          <span className="bed-record-count">
            {filteredBeds.length} records
          </span>
        </div>

        <div className="bed-toolbar">
          <div className="bed-search-wrapper">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search by bed number or ward..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search beds"
            />
          </div>

          <select
            className="bed-filter"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter beds by status"
          >
            <option value="All">All Beds</option>
            <option value="Available">Available</option>
            <option value="Occupied">Occupied</option>
          </select>
        </div>

        <div className="bed-table-wrapper">
          <table className="bed-table">
            <thead>
              <tr>
                <th>BED NUMBER</th>
                <th>WARD</th>
                <th>BED TYPE</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5" className="bed-empty-state">
                    Loading beds...
                  </td>
                </tr>
              )}

              {!loading && filteredBeds.map((bed) => (
                <tr key={bed._id}>
                  <td className="bed-number-cell">{bed.bedNumber}</td>
                  <td>{bed.ward}</td>
                  <td>
                    <span className="bed-type-label">{bed.type}</span>
                  </td>
                  <td>
                    <span
                      className={`bed-status ${
                        bed.status === "Available"
                          ? "status-available"
                          : "status-occupied"
                      }`}
                    >
                      <span />
                      {bed.status}
                    </span>
                  </td>
                  <td>
                    <div className="bed-row-actions">
                      <button
                        type="button"
                        className="bed-edit-button"
                        onClick={() => handleEdit(bed)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="bed-delete-button"
                        onClick={() => handleDelete(bed._id, bed.bedNumber)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!loading && filteredBeds.length === 0 && (
                <tr>
                  <td colSpan="5" className="bed-empty-state">
                    <strong>No beds found</strong>
                    <p>
                      {search || filter !== "All"
                        ? "Try changing your search or filter."
                        : "Add a new bed to get started."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
};

export default BedManagement;
