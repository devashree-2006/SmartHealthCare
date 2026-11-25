
import { useCallback, useEffect, useState } from "react";
import { apiRequest } from "../../services/api";

function StaffTasks() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    try {
      const data = await apiRequest("/staff-tasks");
      setTasks(data);
    } catch (err) {
      setError(err.message || "Unable to load tasks.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load tasks from MongoDB
  useEffect(() => {
    // Loading remote records is an external synchronization effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTasks();
  }, [loadTasks]);

  const completed = tasks.filter(
    t => t.status === "Completed"
  ).length;

  const pending = tasks.filter(
    t => t.status === "Pending"
  ).length;

  const inProgress = tasks.filter(
    t => t.status === "In Progress"
  ).length;

  const progress = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  // Update task status in MongoDB
  const updateStatus = async (id, status) => {
    try {
      setError("");

      const updatedTask = await apiRequest(`/staff-tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      setTasks(prev =>
        prev.map(task =>
          task._id === id ? updatedTask : task
        )
      );
    } catch (err) {
      setError(err.message || "Unable to update task.");
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter =
      filter === "All" || task.status === filter;

    const query = search.toLowerCase();

    const matchesSearch =
      task.title.toLowerCase().includes(query) ||
      task.department.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="staff-tasks-page">
      <style>{`
        .staff-tasks-page {
          min-height:100vh;
          background:#f3f7f6;
          padding:28px;
          color:#243c37;
          font-family:Arial,sans-serif;
        }
        .staff-tasks-page * { box-sizing:border-box; }
        .st-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          flex-wrap:wrap;
          gap:15px;
          margin-bottom:25px;
        }
        .st-header h1 {
          font-size:27px;
          margin:0 0 8px;
          color:#173b35;
        }
        .st-header p {
          color:#82938e;
          font-size:13px;
          margin:0;
        }
        .st-date {
          background:white;
          padding:12px 16px;
          border-radius:10px;
          font-size:12px;
        }
        .st-stats {
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:16px;
          margin-bottom:22px;
        }
        .st-card {
          background:white;
          border-radius:14px;
          padding:20px;
          box-shadow:0 3px 14px #1b44340a;
          min-width:0;
        }
        .st-label {
          color:#82938e;
          font-size:12px;
          margin:0 0 12px;
        }
        .st-number {
          font-size:29px;
          font-weight:bold;
          color:#173b35;
        }
        .st-icon {
          width:40px;
          height:40px;
          border-radius:11px;
          background:#e9f6f0;
          display:grid;
          place-items:center;
          font-size:19px;
          margin-bottom:13px;
        }
        .st-progress-card {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:20px;
          flex-wrap:wrap;
          margin-bottom:22px;
        }
        .st-progress-card h2 {
          font-size:16px;
          margin:0 0 8px;
        }
        .st-progress-card p {
          color:#82938e;
          font-size:12px;
          margin:0;
        }
        .st-progress-bar {
          width:220px;
          max-width:100%;
          height:10px;
          background:#e9efec;
          border-radius:20px;
          overflow:hidden;
          margin-top:12px;
        }
        .st-progress-fill {
          height:100%;
          background:#13966c;
          border-radius:20px;
          transition:width .3s;
        }
        .st-percent {
          font-size:27px;
          font-weight:bold;
          color:#13966c;
        }
        .st-toolbar {
          display:flex;
          justify-content:space-between;
          gap:12px;
          flex-wrap:wrap;
          margin-bottom:17px;
        }
        .st-search {
          padding:12px 14px;
          border:1px solid #e4ebe7;
          border-radius:9px;
          background:white;
          min-width:220px;
          font-size:12px;
          outline:none;
        }
        .st-filters {
          display:flex;
          gap:7px;
          flex-wrap:wrap;
        }
        .st-filter {
          padding:10px 13px;
          border:1px solid #e5ece8;
          border-radius:8px;
          background:white;
          color:#71827b;
          cursor:pointer;
          font-size:11px;
        }
        .st-filter.active {
          background:#13966c;
          color:white;
          border-color:#13966c;
        }
        .st-table-wrap { overflow-x:auto; }
        .st-table {
          width:100%;
          border-collapse:collapse;
          min-width:650px;
        }
        .st-table th {
          padding:14px 12px;
          text-align:left;
          background:#f7faf8;
          color:#84938d;
          font-size:10px;
          text-transform:uppercase;
          letter-spacing:.5px;
        }
        .st-table td {
          padding:16px 12px;
          border-bottom:1px solid #edf1ef;
          font-size:12px;
        }
        .st-table tr:last-child td { border-bottom:0; }
        .st-task-name {
          font-weight:bold;
          color:#29453d;
        }
        .st-badge {
          display:inline-block;
          padding:6px 9px;
          border-radius:20px;
          font-size:10px;
          white-space:nowrap;
        }
        .st-high { background:#fff0ed;color:#d65d4c; }
        .st-medium { background:#fff5e4;color:#b27b26; }
        .st-low { background:#eaf2ff;color:#537cba; }
        .st-select {
          border:1px solid #e4ebe7;
          padding:8px;
          border-radius:7px;
          background:white;
          font-size:11px;
          color:#49635a;
          cursor:pointer;
        }
        .st-empty {
          padding:30px;
          text-align:center;
          color:#82938e;
          font-size:13px;
        }
        .st-error {
          color:#c0392b;
          background:#fff0ed;
          padding:12px;
          border-radius:8px;
          margin-bottom:15px;
          font-size:13px;
        }
        @media(max-width:850px) {
          .st-stats { grid-template-columns:repeat(2,1fr); }
        }
        @media(max-width:550px) {
          .staff-tasks-page { padding:15px; }
          .st-stats { gap:9px; }
          .st-card { padding:14px; }
          .st-number { font-size:24px; }
          .st-search { width:100%;min-width:0; }
        }
      `}</style>

      <div className="st-header">
        <div>
          <h1>My Tasks</h1>
          <p>View, manage and update your assigned hospital duties.</p>
        </div>

        <div className="st-date">
          📅 {new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </div>
      </div>

      {error && <div className="st-error">{error}</div>}

      {loading ? (
        <div className="st-card">Loading staff tasks...</div>
      ) : (
        <>
          <div className="st-stats">
            {[
              ["📋", "Total Tasks", tasks.length],
              ["⏳", "Pending", pending],
              ["🔄", "In Progress", inProgress],
              ["✅", "Completed", completed]
            ].map(([icon, label, value]) => (
              <div className="st-card" key={label}>
                <div className="st-icon">{icon}</div>
                <p className="st-label">{label}</p>
                <div className="st-number">{value}</div>
              </div>
            ))}
          </div>

          <div className="st-card st-progress-card">
            <div>
              <h2>Overall Task Progress</h2>
              <p>
                You have completed {completed} out of {tasks.length} assigned tasks.
              </p>
              <div className="st-progress-bar">
                <div
                  className="st-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <div className="st-percent">{progress}%</div>
          </div>

          <div className="st-card">
            <div className="st-toolbar">
              <input
                className="st-search"
                placeholder="🔎 Search tasks or departments..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />

              <div className="st-filters">
                {["All", "Pending", "In Progress", "Completed"].map(item => (
                  <button
                    key={item}
                    className={`st-filter ${filter === item ? "active" : ""}`}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="st-table-wrap">
              <table className="st-table">
                <thead>
                  <tr>
                    <th>Task Details</th>
                    <th>Department</th>
                    <th>Priority</th>
                    <th>Due Time</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredTasks.map(task => (
                    <tr key={task._id}>
                      <td>
                        <div className="st-task-name">{task.title}</div>
                      </td>
                      <td>{task.department}</td>
                      <td>
                        <span className={`st-badge st-${task.priority.toLowerCase()}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td>{task.due}</td>
                      <td>
                        <select
                          className="st-select"
                          value={task.status}
                          onChange={e =>
                            updateStatus(task._id, e.target.value)
                          }
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}

                  {filteredTasks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="st-empty">
                        No matching tasks found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <p style={{
        textAlign:"center",
        color:"#9aa8a2",
        fontSize:10,
        marginTop:22
      }}>
        CareSync · Staff Task Management
      </p>
    </div>
  );
}

export default StaffTasks;
