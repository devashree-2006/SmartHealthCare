
import React, { useEffect, useRef, useState } from "react";
import { apiRequest } from "../../services/api";

const initialTransfers = [
  {
    patient: "Patient P-1024",
    from: "General Ward",
    to: "ICU",
    reason: "Critical monitoring",
    priority: "High",
    status: "Pending",
    time: "09:30 AM"
  },
  {
    patient: "Patient P-1031",
    from: "Emergency",
    to: "General Ward",
    reason: "Condition stabilized",
    priority: "Medium",
    status: "In Progress",
    time: "11:00 AM"
  },
  {
    patient: "Patient P-1045",
    from: "ICU",
    to: "Private Ward",
    reason: "Recovery and observation",
    priority: "Low",
    status: "Completed",
    time: "01:30 PM"
  },
  {
    patient: "Patient P-1052",
    from: "General Ward",
    to: "Emergency",
    reason: "Further medical evaluation",
    priority: "High",
    status: "Pending",
    time: "02:00 PM"
  }
];

function PatientTransfers() {
  const [transfers, setTransfers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const initialized = useRef(false);

  const [form, setForm] = useState({
    patient: "",
    from: "",
    to: "",
    reason: "",
    priority: "Medium"
  });

  // Load transfers from MongoDB
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const loadTransfers = async () => {
      try {
        setLoading(true);
        setError("");

        let data = await apiRequest("/staff-transfers");

        // Insert sample transfers if database is empty
        if (data.length === 0) {
          const createdTransfers = await Promise.all(
            initialTransfers.map(transfer =>
              apiRequest("/staff-transfers", {
                method: "POST",
                body: JSON.stringify(transfer)
              })
            )
          );

          data = createdTransfers;
        }

        setTransfers(data);
      } catch (err) {
        setError(err.message || "Unable to load patient transfers.");
      } finally {
        setLoading(false);
      }
    };

    loadTransfers();
  }, []);

  const completed = transfers.filter(
    t => t.status === "Completed"
  ).length;

  const pending = transfers.filter(
    t => t.status === "Pending"
  ).length;

  const progress = transfers.filter(
    t => t.status === "In Progress"
  ).length;

  // Update transfer status in MongoDB
  const updateStatus = async (id, status) => {
    try {
      setError("");

      const updatedTransfer = await apiRequest(
        `/staff-transfers/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({ status })
        }
      );

      setTransfers(prev =>
        prev.map(t =>
          t._id === id ? updatedTransfer : t
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update transfer status.");
    }
  };

  // Add new transfer to MongoDB
  const addTransfer = async e => {
    e.preventDefault();

    if (form.from === form.to) {
      alert("Please select different source and destination wards.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const newTransfer = {
        ...form,
        status: "Pending",
        time: new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit"
        })
      };

      const savedTransfer = await apiRequest("/staff-transfers", {
        method: "POST",
        body: JSON.stringify(newTransfer)
      });

      setTransfers(prev => [savedTransfer, ...prev]);

      setForm({
        patient: "",
        from: "",
        to: "",
        reason: "",
        priority: "Medium"
      });

      setShowForm(false);
    } catch (err) {
      setError(err.message || "Unable to create transfer.");
    } finally {
      setSaving(false);
    }
  };

  const filtered = transfers.filter(t => {
    const matchesFilter =
      filter === "All" || t.status === filter;

    const query = search.toLowerCase();

    const matchesSearch =
      t.patient.toLowerCase().includes(query) ||
      t.from.toLowerCase().includes(query) ||
      t.to.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="transfer-page">
      <style>{`
        .transfer-page {
          min-height:100vh;
          padding:28px;
          background:#f3f7f6;
          color:#243c37;
          font-family:Arial,sans-serif;
        }
        .transfer-page * { box-sizing:border-box; }
        .tr-header {
          display:flex;justify-content:space-between;
          align-items:center;gap:15px;flex-wrap:wrap;
          margin-bottom:25px;
        }
        .tr-header h1 {
          margin:0 0 8px;font-size:27px;color:#173b35;
        }
        .tr-header p { margin:0;color:#82938e;font-size:13px; }
        .tr-card {
          background:white;border-radius:14px;padding:20px;
          box-shadow:0 3px 14px #1b44340a;margin-bottom:19px;
        }
        .tr-stats {
          display:grid;grid-template-columns:repeat(4,minmax(0,1fr));
          gap:16px;margin-bottom:20px;
        }
        .tr-icon {
          width:40px;height:40px;border-radius:11px;
          background:#e9f6f0;display:grid;place-items:center;
          font-size:19px;margin-bottom:13px;
        }
        .tr-label { color:#82938e;font-size:12px;margin-bottom:9px; }
        .tr-number { font-size:28px;font-weight:bold;color:#173b35; }
        .tr-button {
          border:0;background:#13966c;color:white;
          padding:11px 16px;border-radius:9px;
          font-weight:bold;cursor:pointer;font-size:12px;
        }
        .tr-button:hover { background:#107b58; }
        .tr-button:disabled {
          background:#aabbb3;cursor:not-allowed;
        }
        .tr-toolbar {
          display:flex;justify-content:space-between;
          flex-wrap:wrap;gap:12px;margin-bottom:18px;
        }
        .tr-search {
          padding:11px 14px;border:1px solid #e4ebe7;
          border-radius:9px;min-width:220px;font-size:12px;
        }
        .tr-filters { display:flex;gap:7px;flex-wrap:wrap; }
        .tr-filter {
          padding:10px 13px;border:1px solid #e4ebe7;
          background:white;border-radius:8px;color:#71827b;
          font-size:11px;cursor:pointer;
        }
        .tr-filter.active {
          background:#13966c;color:white;border-color:#13966c;
        }
        .tr-table-wrap { overflow-x:auto; }
        .tr-table { width:100%;border-collapse:collapse;min-width:720px; }
        .tr-table th {
          background:#f7faf8;padding:14px 12px;text-align:left;
          color:#82938e;font-size:10px;text-transform:uppercase;
        }
        .tr-table td {
          padding:16px 12px;border-bottom:1px solid #edf1ef;
          font-size:12px;
        }
        .tr-table tr:last-child td { border:0; }
        .tr-patient { font-weight:bold;color:#29453d; }
        .tr-badge {
          display:inline-block;padding:6px 9px;
          border-radius:20px;font-size:10px;white-space:nowrap;
        }
        .tr-high { background:#fff0ed;color:#d65d4c; }
        .tr-medium { background:#fff5e4;color:#b27b26; }
        .tr-low { background:#eaf2ff;color:#537cba; }
        .tr-pending { background:#fff5e4;color:#b27b26; }
        .tr-inprogress { background:#eaf2ff;color:#537cba; }
        .tr-completed { background:#e6f6ed;color:#13966c; }
        .tr-select {
          padding:8px;border:1px solid #e4ebe7;
          border-radius:7px;background:white;font-size:11px;
        }
        .tr-modal-bg {
          position:fixed;inset:0;background:#142b2580;
          display:grid;place-items:center;padding:15px;z-index:1000;
        }
        .tr-modal {
          background:white;width:100%;max-width:480px;
          padding:25px;border-radius:15px;max-height:90vh;overflow:auto;
        }
        .tr-modal h2 { margin:0 0 20px;color:#173b35;font-size:19px; }
        .tr-field { margin-bottom:14px; }
        .tr-field label {
          display:block;font-size:12px;font-weight:bold;margin-bottom:7px;
        }
        .tr-field input,.tr-field select,.tr-field textarea {
          width:100%;padding:11px;border:1px solid #dfe9e3;
          border-radius:8px;font-size:12px;background:white;
        }
        .tr-actions { display:flex;gap:10px;margin-top:20px; }
        .tr-cancel {
          background:#edf3ef;color:#52675e;border:0;
          border-radius:8px;padding:11px 16px;cursor:pointer;
        }
        .tr-error {
          color:#c0392b;background:#fff0ed;
          padding:12px;border-radius:8px;
          margin-bottom:15px;font-size:13px;
        }
        @media(max-width:850px) {
          .tr-stats { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:550px) {
          .transfer-page { padding:15px; }
          .tr-card { padding:14px; }
          .tr-search { width:100%;min-width:0; }
        }
      `}</style>

      <div className="tr-header">
        <div>
          <h1>Patient Transfers</h1>
          <p>Manage patient movement between hospital wards.</p>
        </div>

        <button
          className="tr-button"
          onClick={() => setShowForm(true)}
        >
          + New Transfer
        </button>
      </div>

      {error && <div className="tr-error">{error}</div>}

      {loading ? (
        <div className="tr-card">Loading patient transfers...</div>
      ) : (
        <>
          <div className="tr-stats">
            {[
              ["📋", "Total Transfers", transfers.length],
              ["⏳", "Pending", pending],
              ["🔄", "In Progress", progress],
              ["✅", "Completed", completed]
            ].map(([icon, label, value]) => (
              <div className="tr-card" key={label}>
                <div className="tr-icon">{icon}</div>
                <div className="tr-label">{label}</div>
                <div className="tr-number">{value}</div>
              </div>
            ))}
          </div>

          <div className="tr-card">
            <div className="tr-toolbar">
              <input
                className="tr-search"
                placeholder="Search patient or ward..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <div className="tr-filters">
                {["All", "Pending", "In Progress", "Completed"].map(item => (
                  <button
                    key={item}
                    className={`tr-filter ${filter === item ? "active" : ""}`}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="tr-table-wrap">
              <table className="tr-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Reason</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Update</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map(t => (
                    <tr key={t._id}>
                      <td><div className="tr-patient">{t.patient}</div></td>
                      <td>{t.from}</td>
                      <td>{t.to}</td>
                      <td>{t.reason}</td>
                      <td>
                        <span className={`tr-badge tr-${t.priority.toLowerCase()}`}>
                          {t.priority}
                        </span>
                      </td>
                      <td>
                        <span className={`tr-badge tr-${t.status.toLowerCase().replace(" ", "")}`}>
                          {t.status}
                        </span>
                      </td>
                      <td>
                        <select
                          className="tr-select"
                          value={t.status}
                          onChange={e => updateStatus(t._id, e.target.value)}
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="7" style={{textAlign:"center",padding:25}}>
                        No transfers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <div className="tr-modal-bg">
          <form className="tr-modal" onSubmit={addTransfer}>
            <h2>Create Patient Transfer</h2>

            <div className="tr-field">
              <label>Patient ID</label>
              <input
                required
                placeholder="Enter patient ID"
                value={form.patient}
                onChange={e => setForm({...form,patient:e.target.value})}
              />
            </div>

            <div className="tr-field">
              <label>From Ward</label>
              <select
                required
                value={form.from}
                onChange={e => setForm({...form,from:e.target.value})}
              >
                <option value="">Select source ward</option>
                {["General Ward","ICU","Emergency","Private Ward"].map(w =>
                  <option key={w}>{w}</option>
                )}
              </select>
            </div>

            <div className="tr-field">
              <label>To Ward</label>
              <select
                required
                value={form.to}
                onChange={e => setForm({...form,to:e.target.value})}
              >
                <option value="">Select destination ward</option>
                {["General Ward","ICU","Emergency","Private Ward"].map(w =>
                  <option key={w}>{w}</option>
                )}
              </select>
            </div>

            <div className="tr-field">
              <label>Reason for Transfer</label>
              <textarea
                required
                rows="3"
                value={form.reason}
                onChange={e => setForm({...form,reason:e.target.value})}
                placeholder="Enter transfer reason"
              />
            </div>

            <div className="tr-field">
              <label>Priority</label>
              <select
                value={form.priority}
                onChange={e => setForm({...form,priority:e.target.value})}
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="tr-actions">
              <button
                type="button"
                className="tr-cancel"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="tr-button"
                disabled={saving}
              >
                {saving ? "Saving..." : "Create Transfer"}
              </button>
            </div>
          </form>
        </div>
      )}

      <p style={{
        textAlign:"center",
        fontSize:10,
        color:"#9aa8a2",
        marginTop:22
      }}>
        CareSync · Staff Patient Transfer Management
      </p>
    </div>
  );
}

export default PatientTransfers;
