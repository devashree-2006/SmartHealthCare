
import React, { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";
import HandoverTasks from "./HandoverTasks";
import PatientTransfers from "./PatientTransfers";
import Attendance from "./Attendance";
import StaffTasks from "./StaffTasks";

function StaffDashboard({ onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [attendance, setAttendance] = useState(null);
  const [activePage, setActivePage] = useState("Dashboard");
  const [dashboardLoading, setDashboardLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-IN");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setDashboardLoading(true);

      const [taskData, attendanceData] = await Promise.all([
        apiRequest("/staff-tasks"),
        apiRequest("/staff-attendance"),
      ]);

      setTasks(
        taskData.map(task => ({
          ...task,
          done: task.status === "Completed",
        }))
      );

      const todayRecord = attendanceData.find(
        record => record.date === today
      );

      setAttendance(todayRecord || null);
    } catch (error) {
      console.error("Dashboard loading error:", error.message);
    } finally {
      setDashboardLoading(false);
    }
  };

  const completed = tasks.filter(t => t.done).length;

  const percentage = tasks.length
    ? Math.round((completed / tasks.length) * 100)
    : 0;

  const pending = tasks.length - completed;

  const navigation = [
    { name: "Dashboard", icon: "▦" },
    { name: "My Tasks", icon: "✓" },
    { name: "Handover Tasks", icon: "⇄" },
    { name: "Patient Transfers", icon: "♧" },
    { name: "Attendance", icon: "◷" },
    { name: "My Profile", icon: "♙" },
  ];

  const toggleTask = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus
        ? "Pending"
        : "Completed";

      const updated = await apiRequest(`/staff-tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });

      setTasks(prev =>
        prev.map(task =>
          task._id === id
            ? { ...task, ...updated, done: updated.status === "Completed" }
            : task
        )
      );
    } catch (error) {
      console.error("Task update failed:", error.message);
      alert("Unable to update task. Please try again.");
    }
  };

  const circumference = 2 * Math.PI * 48;

  const attendanceStatus = attendance?.checkOut
    ? "Checked Out"
    : attendance?.checkIn
    ? "Checked In"
    : "Not Checked In";

  return (
    <div className="sp">
      <style>{`
        .sp {
          --green:#13966c;
          --dark:#173b35;
          --muted:#82938e;
          min-height:100vh;
          background:#f3f7f6;
          color:#243c37;
          display:flex;
          font-family:Arial,sans-serif;
        }
        .sp * { box-sizing:border-box; }
        .sp-sidebar {
          width:245px;
          background:#fff;
          padding:26px 17px;
          border-right:1px solid #e9efed;
          display:flex;
          flex-direction:column;
          flex-shrink:0;
        }
        .sp-brand {
          display:flex;
          align-items:center;
          gap:11px;
          padding:0 10px 30px;
        }
        .sp-logo {
          width:42px;
          height:42px;
          border-radius:12px;
          background:var(--green);
          color:white;
          display:grid;
          place-items:center;
          font-size:23px;
          font-weight:bold;
        }
        .sp-brand h2 {
          margin:0;
          font-size:21px;
          color:var(--dark);
        }
        .sp-brand small {
          color:var(--muted);
          font-size:11px;
        }
        .sp-label {
          color:#9aa9a4;
          font-size:10px;
          font-weight:bold;
          letter-spacing:1.2px;
          padding:12px;
        }
        .sp-nav {
          display:flex;
          flex-direction:column;
          gap:5px;
        }
        .sp-nav button {
          border:0;
          background:transparent;
          text-align:left;
          padding:12px;
          border-radius:9px;
          color:#63756f;
          font-size:13px;
          cursor:pointer;
          display:flex;
          gap:13px;
          align-items:center;
        }
        .sp-nav button.active {
          background:#e9f6f0;
          color:var(--green);
          font-weight:bold;
        }
        .sp-nav button:hover {
          background:#f0f6f3;
        }
        .sp-nav-icon {
          width:20px;
          font-size:18px;
          text-align:center;
        }
        .sp-help {
          margin-top:auto;
          background:#eff8f4;
          border-radius:12px;
          padding:15px;
        }
        .sp-help strong {
          font-size:13px;
        }
        .sp-help p {
          font-size:11px;
          color:#71867e;
          line-height:1.6;
        }
        .sp-main {
          flex:1;
          min-width:0;
          padding:27px 30px;
        }
        .sp-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:15px;
          flex-wrap:wrap;
          margin-bottom:27px;
        }
        .sp-header h1 {
          font-size:25px;
          margin:0 0 7px;
          color:var(--dark);
        }
        .sp-header p {
          margin:0;
          color:var(--muted);
          font-size:13px;
        }
        .sp-user {
          display:flex;
          align-items:center;
          gap:11px;
          background:white;
          padding:9px 14px;
          border-radius:12px;
        }
        .sp-avatar {
          width:39px;
          height:39px;
          background:#dff2e9;
          color:var(--green);
          border-radius:50%;
          display:grid;
          place-items:center;
          font-weight:bold;
        }
        .sp-user strong {
          display:block;
          font-size:12px;
        }
        .sp-user small {
          color:var(--muted);
          font-size:10px;
        }
        .sp-stats {
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:16px;
          margin-bottom:20px;
        }
        .sp-card {
          background:white;
          border-radius:14px;
          padding:20px;
          box-shadow:0 3px 14px #1b44340a;
          min-width:0;
        }
        .sp-stat-icon {
          width:39px;
          height:39px;
          border-radius:11px;
          background:#e9f6f0;
          display:grid;
          place-items:center;
          font-size:19px;
        }
        .sp-stat-label {
          color:var(--muted);
          font-size:12px;
          margin:14px 0 8px;
        }
        .sp-stat-number {
          font-size:27px;
          font-weight:bold;
          color:var(--dark);
        }
        .sp-stat-note {
          font-size:10px;
          color:var(--muted);
          margin-top:7px;
        }
        .sp-grid {
          display:grid;
          grid-template-columns:1.4fr 1fr;
          gap:18px;
          margin-bottom:19px;
        }
        .sp-card h2 {
          font-size:16px;
          margin:0 0 18px;
          color:var(--dark);
        }
        .sp-progress {
          display:flex;
          align-items:center;
          gap:24px;
          flex-wrap:wrap;
        }
        .sp-circle {
          width:140px;
          height:140px;
          flex-shrink:0;
        }
        .sp-circle text {
          font-size:22px;
          fill:var(--dark);
          font-weight:bold;
        }
        .sp-progress h3 {
          font-size:22px;
          margin:0 0 8px;
        }
        .sp-progress p {
          color:var(--muted);
          font-size:12px;
          line-height:1.6;
        }
        .sp-task {
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:10px;
          padding:13px 0;
          border-bottom:1px solid #edf1ef;
        }
        .sp-task:last-child {
          border:0;
        }
        .sp-task-left {
          display:flex;
          align-items:center;
          gap:10px;
          min-width:0;
        }
        .sp-task input {
          accent-color:var(--green);
          width:17px;
          height:17px;
        }
        .sp-task-title {
          font-size:12px;
          font-weight:bold;
        }
        .sp-task.done .sp-task-title {
          text-decoration:line-through;
          color:#a0aaa6;
        }
        .sp-task small {
          display:block;
          color:var(--muted);
          font-size:10px;
          margin-top:5px;
        }
        .sp-priority {
          font-size:10px;
          padding:5px 8px;
          border-radius:15px;
          white-space:nowrap;
        }
        .sp-high {
          background:#fff0ed;
          color:#d65d4c;
        }
        .sp-medium {
          background:#fff5e4;
          color:#b27b26;
        }
        .sp-info-row {
          display:flex;
          justify-content:space-between;
          gap:10px;
          padding:13px 0;
          border-bottom:1px solid #edf1ef;
          font-size:12px;
        }
        .sp-info-row:last-child {
          border:0;
        }
        .sp-muted {
          color:var(--muted);
        }
        .sp-button {
          width:100%;
          border:0;
          background:var(--green);
          color:white;
          padding:12px;
          border-radius:9px;
          font-weight:bold;
          cursor:pointer;
          margin-top:14px;
        }
        .sp-notice {
          font-size:12px;
          padding:13px 0;
          border-bottom:1px solid #edf1ef;
          line-height:1.5;
        }
        .sp-notice:last-child {
          border:0;
        }
        .sp-dot {
          display:inline-block;
          width:7px;
          height:7px;
          background:var(--green);
          border-radius:50%;
          margin-right:9px;
        }
        @media(max-width:1000px) {
          .sp-sidebar { width:205px; }
          .sp-main { padding:20px; }
          .sp-stats { grid-template-columns:repeat(2,1fr); }
          .sp-grid { grid-template-columns:1fr; }
        }
        @media(max-width:650px) {
          .sp { display:block; }
          .sp-sidebar { width:100%;padding:12px; }
          .sp-brand { padding:5px 8px 12px; }
          .sp-label,.sp-help { display:none; }
          .sp-nav { flex-direction:row;overflow-x:auto; }
          .sp-nav button { white-space:nowrap;padding:10px; }
          .sp-main { padding:16px; }
          .sp-stats { gap:10px; }
          .sp-card { padding:15px; }
          .sp-progress { gap:12px; }
          .sp-circle { width:110px;height:110px; }
        }
      `}</style>

      <aside className="sp-sidebar">
        <div className="sp-brand">
          <div className="sp-logo">✚</div>
          <div>
            <h2>CareSync</h2>
            <small>Staff Portal</small>
          </div>
        </div>

        <div className="sp-label">STAFF WORKSPACE</div>

        <nav className="sp-nav">
          {navigation.map(item => (
            <button
              key={item.name}
              className={activePage === item.name ? "active" : ""}
              onClick={() => setActivePage(item.name)}
            >
              <span className="sp-nav-icon">{item.icon}</span>
              {item.name}
            </button>
          ))}
        </nav>

        <div className="sp-help">
          <strong>Need assistance?</strong>
          <p>Contact your hospital administrator for support.</p>
        </div>
      </aside>

      <main className="sp-main">
        <header className="sp-header">
          <div>
            <h1>
              {activePage === "Dashboard" ? "Staff Dashboard" : activePage}
            </h1>
            <p>Welcome back! Here's your hospital workspace.</p>
          </div>

          <div className="sp-user">
            <div className="sp-avatar">S</div>
            <div>
              <strong>Hospital Staff</strong>
              <small>Staff Member</small>
            </div>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <>
            {dashboardLoading ? (
              <div className="sp-card">Loading dashboard data...</div>
            ) : (
              <>
                <section className="sp-stats">
                  {[
                    ["▤", "Total Tasks", tasks.length, "Assigned tasks"],
                    ["✓", "Completed", completed, "Tasks finished"],
                    ["◷", "Pending", pending, "Tasks remaining"],
                    ["♧", "Department", "General Ward", "Assigned department"]
                  ].map(([icon, label, value, note]) => (
                    <div className="sp-card" key={label}>
                      <div className="sp-stat-icon">{icon}</div>
                      <div className="sp-stat-label">{label}</div>
                      <div className="sp-stat-number">{value}</div>
                      <div className="sp-stat-note">{note}</div>
                    </div>
                  ))}
                </section>

                <section className="sp-grid">
                  <div className="sp-card">
                    <h2>My Task Completion</h2>
                    <div className="sp-progress">
                      <svg className="sp-circle" viewBox="0 0 120 120">
                        <circle
                          cx="60" cy="60" r="48"
                          fill="none" stroke="#e8efeb" strokeWidth="10"
                        />
                        <circle
                          cx="60" cy="60" r="48"
                          fill="none" stroke="#13966c" strokeWidth="10"
                          strokeLinecap="round"
                          strokeDasharray={circumference}
                          strokeDashoffset={circumference * (1 - percentage / 100)}
                          transform="rotate(-90 60 60)"
                          style={{ transition: "stroke-dashoffset .4s" }}
                        />
                        <text x="60" y="68" textAnchor="middle">
                          {percentage}%
                        </text>
                      </svg>

                      <div>
                        <h3>{percentage}% Completed</h3>
                        <p>
                          You have finished {completed} of {tasks.length} assigned tasks.
                        </p>
                        <p style={{ color: "#13966c", fontWeight: "bold" }}>
                          {pending === 0 ? "All tasks completed!" : "Keep up the good work!"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="sp-card">
                    <h2>Attendance Overview</h2>

                    <div className="sp-info-row">
                      <span className="sp-muted">Today's Status</span>
                      <strong style={{
                        color: attendance?.checkOut || attendance?.checkIn
                          ? "#13966c"
                          : "#c18b32"
                      }}>
                        {attendanceStatus}
                      </strong>
                    </div>

                    <div className="sp-info-row">
                      <span className="sp-muted">Shift</span>
                      <strong>Morning</strong>
                    </div>

                    <div className="sp-info-row">
                      <span className="sp-muted">Check In</span>
                      <strong>{attendance?.checkIn || "Not recorded"}</strong>
                    </div>

                    <div className="sp-info-row">
                      <span className="sp-muted">Check Out</span>
                      <strong>{attendance?.checkOut || "Not recorded"}</strong>
                    </div>

                    <button
                      className="sp-button"
                      onClick={() => setActivePage("Attendance")}
                    >
                      View Attendance
                    </button>
                  </div>
                </section>

                <section className="sp-grid">
                  <div className="sp-card">
                    <h2>Today's Assigned Tasks</h2>

                    {tasks.length === 0 ? (
                      <p className="sp-muted">No tasks assigned.</p>
                    ) : (
                      tasks.map(task => (
                        <div
                          className={`sp-task ${task.done ? "done" : ""}`}
                          key={task._id}
                        >
                          <div className="sp-task-left">
                            <input
                              type="checkbox"
                              checked={task.done}
                              onChange={() => toggleTask(task._id, task.done)}
                            />
                            <div>
                              <div className="sp-task-title">{task.title}</div>
                              <small>{task.due || "No time specified"}</small>
                            </div>
                          </div>

                          <span className={`sp-priority ${
                            task.priority === "High" ? "sp-high" : "sp-medium"
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                    <div className="sp-card">
                      <h2>My Shift Information</h2>
                      <div className="sp-info-row">
                        <span className="sp-muted">Shift</span>
                        <strong>Morning</strong>
                      </div>
                      <div className="sp-info-row">
                        <span className="sp-muted">Working Hours</span>
                        <strong>8 AM – 4 PM</strong>
                      </div>
                      <div className="sp-info-row">
                        <span className="sp-muted">Department</span>
                        <strong>General Ward</strong>
                      </div>
                    </div>

                    <div className="sp-card">
                      <h2>Recent Notifications</h2>
                      <div className="sp-notice">
                        <span className="sp-dot"></span>
                        New tasks have been assigned today.
                      </div>
                      <div className="sp-notice">
                        <span className="sp-dot"></span>
                        Please complete your shift handover.
                      </div>
                      <div className="sp-notice">
                        <span className="sp-dot"></span>
                        Remember to update patient records.
                      </div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </>
        )}

        {activePage === "My Tasks" && <StaffTasks />}

        {activePage === "Handover Tasks" && <HandoverTasks />}

        {activePage === "Patient Transfers" && <PatientTransfers />}

        {activePage === "Attendance" && <Attendance />}

        {activePage === "My Profile" && (
          <div className="sp-card">
            <h2>My Profile</h2>
            <div className="sp-info-row">
              <span className="sp-muted">Name</span>
              <strong>Hospital Staff</strong>
            </div>
            <div className="sp-info-row">
              <span className="sp-muted">Role</span>
              <strong>Staff Member</strong>
            </div>
            <div className="sp-info-row">
              <span className="sp-muted">Department</span>
              <strong>General Ward</strong>
            </div>
            <div className="sp-info-row">
              <span className="sp-muted">Shift</span>
              <strong>Morning</strong>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default StaffDashboard;
