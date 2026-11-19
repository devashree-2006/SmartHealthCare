
import React, { useMemo, useState } from "react";

const sampleRecords = [
  {
    id: 1,
    title: "Complete Blood Count",
    type: "Lab Report",
    date: "2026-10-12",
    doctor: "Dr. Ananya Rao",
    department: "Cardiology",
    summary: "Sample blood test report for demonstration.",
    details:
      "This is sample information only. Actual test values and clinical interpretation must come from an authorized medical record.",
  },
  {
    id: 2,
    title: "General Health Checkup",
    type: "Consultation",
    date: "2026-10-08",
    doctor: "Dr. Rahul Sharma",
    department: "General Medicine",
    summary: "Sample general consultation record.",
    details:
      "This demonstration record represents a general health consultation. It does not contain real patient findings.",
  },
  {
    id: 3,
    title: "Medication Instructions",
    type: "Prescription",
    date: "2026-10-05",
    doctor: "Dr. Rahul Sharma",
    department: "General Medicine",
    summary: "Sample prescription information.",
    details:
      "This is not a real prescription. Do not use this sample to make medication decisions.",
  },
  {
    id: 4,
    title: "Skin Consultation",
    type: "Consultation",
    date: "2026-09-28",
    doctor: "Dr. Meera Nair",
    department: "Dermatology",
    summary: "Sample dermatology consultation.",
    details:
      "This sample represents a dermatology visit. Actual diagnosis and treatment advice must be provided by a qualified clinician.",
  },
  {
    id: 5,
    title: "Blood Sugar Test",
    type: "Lab Report",
    date: "2026-09-20",
    doctor: "Dr. Ananya Rao",
    department: "Laboratory",
    summary: "Sample laboratory test entry.",
    details:
      "No actual test result is provided in this demonstration record.",
  },
];

const filters = ["All Records", "Lab Report", "Prescription", "Consultation"];

function formatDate(date) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function MedicalRecords() {
  const [records] = useState(sampleRecords);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Records");
  const [selectedRecord, setSelectedRecord] = useState(null);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const matchesFilter =
        activeFilter === "All Records" || record.type === activeFilter;

      const searchText = search.toLowerCase().trim();
      const matchesSearch =
        record.title.toLowerCase().includes(searchText) ||
        record.type.toLowerCase().includes(searchText) ||
        record.doctor.toLowerCase().includes(searchText) ||
        record.department.toLowerCase().includes(searchText);

      return matchesFilter && matchesSearch;
    });
  }, [records, activeFilter, search]);

  const downloadRecord = (record) => {
    const content = [
      "CareSync — Sample Medical Record",
      "--------------------------------",
      `Record: ${record.title}`,
      `Type: ${record.type}`,
      `Date: ${formatDate(record.date)}`,
      `Doctor: ${record.doctor}`,
      `Department: ${record.department}`,
      "",
      "Summary:",
      record.summary,
      "",
      "Details:",
      record.details,
      "",
      "DEMO ONLY: This is sample data, not an official medical document.",
    ].join("\n");

    const file = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${record.title.replace(/[^a-z0-9]/gi, "_")}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="patient-dashboard medical-records-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">YOUR HEALTH INFORMATION</p>
          <h1>Medical Records</h1>
          <p className="subtitle">
            Find and review your health record entries.
          </p>
        </div>
        <div className="patient-avatar">📋</div>
      </div>

      <section className="welcome-card">
        <div>
          <p className="welcome-label">YOUR RECORDS, ORGANIZED</p>
          <h2>Your health history at a glance.</h2>
          <p>
            Search records, explore details, or download a sample copy.
          </p>
        </div>
        <span className="welcome-icon">♡</span>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div className="stat-icon">📁</div>
          <p>Total records</p>
          <h2>{records.length}</h2>
          <span>Sample entries</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon">🧪</div>
          <p>Lab reports</p>
          <h2>{records.filter((r) => r.type === "Lab Report").length}</h2>
          <span>Sample results</span>
        </article>

        <article className="stat-card">
          <div className="stat-icon">💊</div>
          <p>Prescriptions</p>
          <h2>{records.filter((r) => r.type === "Prescription").length}</h2>
          <span>Sample entries</span>
        </article>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Record library</h2>
            <p>Search by record name, doctor, or department.</p>
          </div>
        </div>

        <div className="record-search">
          <span>⌕</span>
          <input
            type="search"
            placeholder="Search medical records..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search medical records"
          />
        </div>

        <div className="record-filter-buttons">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`record-filter ${
                activeFilter === filter ? "active" : ""
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <p className="record-result-count">
          Showing {filteredRecords.length}{" "}
          {filteredRecords.length === 1 ? "record" : "records"}
        </p>

        {filteredRecords.length === 0 ? (
          <div className="empty-state">
            <span>🔎</span>
            <h3>No matching records</h3>
            <p>Try another search or select a different filter.</p>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("All Records");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="medical-record-list">
            {filteredRecords.map((record) => (
              <article className="medical-record-card" key={record.id}>
                <div className="record-icon">
                  {record.type === "Lab Report"
                    ? "🧪"
                    : record.type === "Prescription"
                    ? "💊"
                    : "🩺"}
                </div>

                <div className="record-details">
                  <span className="record-type-label">{record.type}</span>
                  <h3>{record.title}</h3>
                  <p>{record.summary}</p>
                  <span className="record-date">
                    {formatDate(record.date)} · {record.doctor}
                  </span>
                </div>

                <div className="record-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => setSelectedRecord(record)}
                  >
                    View details
                  </button>
                  <button
                    type="button"
                    className="primary-button"
                    onClick={() => downloadRecord(record)}
                  >
                    Download
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <p className="demo-note">
        Demo only · These are fictional sample entries. Real medical records
        must be retrieved securely from the authorized backend.
      </p>

      {selectedRecord && (
        <div
          className="record-modal"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedRecord(null);
            }
          }}
        >
          <div
            className="record-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="record-modal-title"
          >
            <button
              className="modal-close"
              type="button"
              onClick={() => setSelectedRecord(null)}
              aria-label="Close record details"
            >
              ×
            </button>

            <p className="eyebrow">RECORD DETAILS</p>
            <h2 id="record-modal-title">{selectedRecord.title}</h2>

            <div className="record-detail-grid">
              <div>
                <span>Record type</span>
                <strong>{selectedRecord.type}</strong>
              </div>
              <div>
                <span>Date</span>
                <strong>{formatDate(selectedRecord.date)}</strong>
              </div>
              <div>
                <span>Doctor</span>
                <strong>{selectedRecord.doctor}</strong>
              </div>
              <div>
                <span>Department</span>
                <strong>{selectedRecord.department}</strong>
              </div>
            </div>

            <h3>Summary</h3>
            <p>{selectedRecord.summary}</p>

            <h3>Additional information</h3>
            <p>{selectedRecord.details}</p>

            <div className="record-modal-actions">
              <button
                className="primary-button"
                type="button"
                onClick={() => downloadRecord(selectedRecord)}
              >
                Download sample
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => window.print()}
              >
                Print
              </button>
              <button
                className="secondary-button"
                type="button"
                onClick={() => setSelectedRecord(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MedicalRecords;
