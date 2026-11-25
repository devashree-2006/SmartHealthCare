import { useCallback, useState, useEffect } from "react";
import { apiRequest } from "../../services/api";

function HandoverTasks() {
  const [handovers, setHandovers] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHandovers = useCallback(async () => {
    try {
      const data = await apiRequest("/staff-handovers");
      setHandovers(data);
    } catch (err) {
      setError(err.message || "Failed to load handovers");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Loading remote records is an external synchronization effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHandovers();
  }, [loadHandovers]);

  const completed = handovers.filter(
    h => h.status === "Completed"
  ).length;

  const pending = handovers.filter(
    h => h.status === "Pending"
  ).length;

  const updateStatus = async (id, status) => {
    try {
      setError("");

      const updated = await apiRequest(`/staff-handovers/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      setHandovers(prev =>
        prev.map(h => h._id === id ? updated : h)
      );

      setSelected(prev =>
        prev && prev._id === id ? updated : prev
      );
    } catch (err) {
      setError(err.message || "Failed to update handover");
    }
  };

  const filtered = handovers.filter(h => {
    const matchesFilter =
      filter === "All" || h.status === filter;

    const matchesSearch =
      h.patient.toLowerCase().includes(search.toLowerCase()) ||
      h.ward.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="handover-page">
      <style>{`
        .handover-page {
          min-height:100vh;
          padding:28px;
          background:#f3f7f6;
          color:#243c37;
          font-family:Arial,sans-serif;
        }
        .handover-page * { box-sizing:border-box; }
        .ho-header {
          display:flex;justify-content:space-between;
          align-items:center;flex-wrap:wrap;gap:15px;
          margin-bottom:25px;
        }
        .ho-header h1 { margin:0 0 8px;font-size:27px;color:#173b35; }
        .ho-header p { margin:0;color:#82938e;font-size:13px; }
        .ho-card {
          background:white;border-radius:14px;padding:20px;
          box-shadow:0 3px 14px #1b44340a;margin-bottom:19px;
        }
        .ho-stats {
          display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
          gap:16px;margin-bottom:20px;
        }
        .ho-stat-icon {
          width:40px;height:40px;background:#e9f6f0;
          border-radius:11px;display:grid;place-items:center;
          font-size:19px;margin-bottom:13px;
        }
        .ho-stat-label { color:#82938e;font-size:12px;margin-bottom:9px; }
        .ho-stat-number { font-size:28px;font-weight:bold;color:#173b35; }
        .ho-toolbar {
          display:flex;justify-content:space-between;
          gap:12px;flex-wrap:wrap;margin-bottom:18px;
        }
        .ho-search {
          padding:11px 14px;border:1px solid #e4ebe7;
          border-radius:9px;background:white;min-width:220px;
          font-size:12px;outline:none;
        }
        .ho-filters { display:flex;gap:7px;flex-wrap:wrap; }
        .ho-filter {
          border:1px solid #e4ebe7;background:white;
          padding:10px 13px;border-radius:8px;
          font-size:11px;color:#71827b;cursor:pointer;
        }
        .ho-filter.active { background:#13966c;color:white;border-color:#13966c; }
        .ho-table-wrap { overflow-x:auto; }
        .ho-table { width:100%;border-collapse:collapse;min-width:700px; }
        .ho-table th {
          padding:14px 12px;text-align:left;background:#f7faf8;
          color:#82938e;font-size:10px;text-transform:uppercase;
        }
        .ho-table td {
          padding:16px 12px;border-bottom:1px solid #edf1ef;
          font-size:12px;
        }
        .ho-table tr:last-child td { border-bottom:0; }
        .ho-patient { font-weight:bold;color:#29453d; }
        .ho-muted { color:#82938e;font-size:11px;margin-top:5px; }
        .ho-badge {
          padding:6px 9px;border-radius:20px;
          font-size:10px;white-space:nowrap;display:inline-block;
        }
        .ho-stable { background:#e6f6ed;color:#13966c; }
        .ho-critical { background:#fff0ed;color:#d65d4c; }
        .ho-observation { background:#fff5e4;color:#b27b26; }
        .ho-pending { background:#fff5e4;color:#b27b26; }
        .ho-completed { background:#e6f6ed;color:#13966c; }
        .ho-button {
          border:0;background:#13966c;color:white;
          padding:8px 11px;border-radius:7px;cursor:pointer;font-size:11px;
        }
        .ho-secondary { background:#e9f6f0;color:#13966c; }
        .ho-modal-bg {
          position:fixed;inset:0;background:#142b2580;
          display:grid;place-items:center;padding:15px;z-index:1000;
        }
        .ho-modal {
          background:white;width:100%;max-width:450px;
          border-radius:15px;padding:24px;max-height:85vh;overflow:auto;
        }
        .ho-modal h2 { margin-top:0;color:#173b35;font-size:19px; }
        .ho-modal p { font-size:13px;line-height:1.7;color:#61756c; }
        .ho-close {
          float:right;border:0;background:#edf4f0;
          border-radius:7px;padding:7px 11px;cursor:pointer;
        }
        @media(max-width:700px) {
          .handover-page { padding:15px; }
          .ho-stats { grid-template-columns:1fr;gap:10px; }
          .ho-card { padding:15px; }
          .ho-search { width:100%;min-width:0; }
        }
      `}</style>

      <div className="ho-header">
        <div>
          <h1>Patient Handover Tasks</h1>
          <p>Manage and review patient information during shift changes.</p>
        </div>
        <span>📋 CareSync Staff Portal</span>
      </div>

      {error && (
        <div className="ho-card" style={{ color: "#d65d4c" }}>
          {error}
          <button className="ho-button" onClick={loadHandovers}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="ho-card">Loading handover tasks...</div>
      ) : (
        <>
          <div className="ho-stats">
            <div className="ho-card">
              <div className="ho-stat-icon">📋</div>
              <div className="ho-stat-label">Total Handovers</div>
              <div className="ho-stat-number">{handovers.length}</div>
            </div>
            <div className="ho-card">
              <div className="ho-stat-icon">⏳</div>
              <div className="ho-stat-label">Pending Handovers</div>
              <div className="ho-stat-number">{pending}</div>
            </div>
            <div className="ho-card">
              <div className="ho-stat-icon">✅</div>
              <div className="ho-stat-label">Completed Handovers</div>
              <div className="ho-stat-number">{completed}</div>
            </div>
          </div>

          <div className="ho-card">
            <div className="ho-toolbar">
              <input
                className="ho-search"
                placeholder="🔍 Search patient or ward..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <div className="ho-filters">
                {["All", "Pending", "Completed"].map(item => (
                  <button
                    key={item}
                    className={`ho-filter ${filter === item ? "active" : ""}`}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="ho-table-wrap">
              <table className="ho-table">
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Ward</th>
                    <th>Shift Transfer</th>
                    <th>Condition</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(h => (
                    <tr key={h._id}>
                      <td><div className="ho-patient">{h.patient}</div></td>
                      <td>{h.ward}</td>
                      <td>{h.from} → {h.to}</td>
                      <td>
                        <span className={`ho-badge ${
                          h.condition === "Stable" ? "ho-stable" :
                          h.condition === "Critical" ? "ho-critical" : "ho-observation"
                        }`}>
                          {h.condition}
                        </span>
                      </td>
                      <td>
                        <span className={`ho-badge ${
                          h.status === "Completed" ? "ho-completed" : "ho-pending"
                        }`}>
                          {h.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="ho-button ho-secondary"
                          onClick={() => setSelected(h)}
                        >
                          View
                        </button>
                        {h.status === "Pending" && (
                          <button
                            className="ho-button"
                            style={{ marginLeft: 5 }}
                            onClick={() => updateStatus(h._id, "Completed")}
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: "center", padding: 25 }}>
                        No handovers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {selected && (
        <div className="ho-modal-bg" onClick={() => setSelected(null)}>
          <div className="ho-modal" onClick={e => e.stopPropagation()}>
            <button className="ho-close" onClick={() => setSelected(null)}>✕</button>
            <h2>Handover Details</h2>
            <p><strong>Patient:</strong> {selected.patient}</p>
            <p><strong>Ward:</strong> {selected.ward}</p>
            <p><strong>From:</strong> {selected.from}</p>
            <p><strong>To:</strong> {selected.to}</p>
            <p><strong>Condition:</strong> {selected.condition}</p>
            <p><strong>Handover Notes:</strong> {selected.notes}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            {selected.status === "Pending" && (
              <button
                className="ho-button"
                onClick={() => updateStatus(selected._id, "Completed")}
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default HandoverTasks;
