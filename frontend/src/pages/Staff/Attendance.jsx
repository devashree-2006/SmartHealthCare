
import { useCallback, useState, useEffect } from "react";
import { apiRequest } from "../../services/api";

function Attendance() {
  const today = new Date().toLocaleDateString("en-IN");

  const [attendance, setAttendance] = useState({
    status: "Not Checked In",
    checkIn: "",
    checkOut: "",
    records: [],
    todayId: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { status, checkIn, checkOut, records } = attendance;

  const loadAttendance = useCallback(async () => {
    try {
      const data = await apiRequest("/staff-attendance");

      const todayRecord = data.find(record => record.date === today);

      let currentStatus = "Not Checked In";

      if (todayRecord?.checkIn && !todayRecord?.checkOut) {
        currentStatus = "Checked In";
      } else if (todayRecord?.checkOut) {
        currentStatus = "Checked Out";
      }

      setAttendance({
        status: currentStatus,
        checkIn: todayRecord?.checkIn || "",
        checkOut: todayRecord?.checkOut || "",
        records: data,
        todayId: todayRecord?._id || null,
      });
    } catch (err) {
      setError(err.message || "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    // Loading remote records is an external synchronization effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAttendance();
  }, [loadAttendance]);

  const getTime = () =>
    new Date().toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleCheckIn = async () => {
    if (status === "Checked In" || status === "Checked Out") return;

    try {
      setError("");

      const time = getTime();

      const record = await apiRequest("/staff-attendance", {
        method: "POST",
        body: JSON.stringify({
          date: today,
          checkIn: time,
          checkOut: "",
          status: "Present",
        }),
      });

      setAttendance(prev => ({
        ...prev,
        status: "Checked In",
        checkIn: time,
        checkOut: "",
        todayId: record._id,
        records: [record, ...prev.records],
      }));
    } catch (err) {
      setError(err.message || "Check-in failed");
    }
  };

  const handleCheckOut = async () => {
    if (status !== "Checked In" || !attendance.todayId) return;

    try {
      setError("");

      const time = getTime();

      const updated = await apiRequest(
        `/staff-attendance/${attendance.todayId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            checkOut: time,
          }),
        }
      );

      setAttendance(prev => ({
        ...prev,
        status: "Checked Out",
        checkOut: time,
        records: prev.records.map(record =>
          record._id === updated._id ? updated : record
        ),
      }));
    } catch (err) {
      setError(err.message || "Check-out failed");
    }
  };

  return (
    <div style={{ color: "#173b35" }}>
      <style>{`
        .att-card {
          background:white;
          padding:22px;
          border-radius:14px;
          box-shadow:0 3px 14px #1b44340a;
          margin-bottom:20px;
        }
        .att-grid {
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:16px;
          margin-bottom:20px;
        }
        .att-label { color:#82938e;font-size:12px;margin-bottom:10px; }
        .att-value { font-size:24px;font-weight:bold; }
        .att-btn {
          border:0;background:#13966c;color:white;
          padding:12px 20px;border-radius:8px;
          cursor:pointer;font-weight:bold;margin-right:10px;
        }
        .att-btn:disabled { background:#aabbb3;cursor:not-allowed; }
        .att-table { width:100%;border-collapse:collapse; }
        .att-table th,.att-table td {
          padding:14px;text-align:left;
          border-bottom:1px solid #edf1ef;font-size:12px;
        }
        .att-table th { background:#f5f8f6;color:#82938e; }
        @media(max-width:650px) {
          .att-grid { grid-template-columns:1fr; }
          .att-card { overflow-x:auto; }
        }
      `}</style>

      <h2 style={{ fontSize:20 }}>My Attendance</h2>
      <p style={{ color:"#82938e",fontSize:13,marginBottom:22 }}>
        Track your daily attendance and working hours.
      </p>

      {error && (
        <div className="att-card" style={{ color:"#d65d4c" }}>
          {error}
          <button className="att-btn" onClick={loadAttendance}>
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="att-card">Loading attendance...</div>
      ) : (
        <>
          <div className="att-grid">
            <div className="att-card">
              <div className="att-label">Today's Date</div>
              <div className="att-value">{today}</div>
            </div>

            <div className="att-card">
              <div className="att-label">Attendance Status</div>
              <div
                className="att-value"
                style={{
                  color: status === "Not Checked In" ? "#c18b32" : "#13966c",
                  fontSize:19,
                }}
              >
                {status}
              </div>
            </div>

            <div className="att-card">
              <div className="att-label">Working Shift</div>
              <div className="att-value">Morning</div>
              <small style={{color:"#82938e"}}>8 AM – 4 PM</small>
            </div>
          </div>

          <div className="att-card">
            <h3 style={{marginTop:0}}>Attendance Check In / Check Out</h3>

            <p style={{fontSize:13,color:"#82938e"}}>
              Check-in: {checkIn || "Not recorded"}
            </p>

            <p style={{fontSize:13,color:"#82938e"}}>
              Check-out: {checkOut || "Not recorded"}
            </p>

            <button
              className="att-btn"
              onClick={handleCheckIn}
              disabled={status !== "Not Checked In"}
            >
              Check In
            </button>

            <button
              className="att-btn"
              onClick={handleCheckOut}
              disabled={status !== "Checked In"}
            >
              Check Out
            </button>
          </div>

          <div className="att-card">
            <h3 style={{marginTop:0}}>Attendance History</h3>

            <table className="att-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {records.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{textAlign:"center"}}>
                      No attendance records yet.
                    </td>
                  </tr>
                ) : (
                  records.map(record => (
                    <tr key={record._id}>
                      <td>{record.date}</td>
                      <td>{record.checkIn || "Not recorded"}</td>
                      <td>{record.checkOut || "Not recorded"}</td>
                      <td>{record.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default Attendance;
