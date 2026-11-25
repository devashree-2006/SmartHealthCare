import { useState } from "react";
import { apiRequest } from "../../services/api";

function StaffAccess({ onLogin, onBack }) {
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await apiRequest("/auth/staff-login", {
        method: "POST",
        body: JSON.stringify({ staffId, password }),
      });
      onLogin(user);
    } catch (loginError) {
      setError(loginError.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 420, margin: "10vh auto", padding: 28, fontFamily: "Arial, sans-serif", color: "#173b35", background: "white", borderRadius: 14, boxShadow: "0 8px 30px #173b3518" }}>
      <button type="button" onClick={onBack}>← Back to portals</button>
      <h1>Staff Portal</h1>
      <p>Sign in with the credentials provided by your administrator.</p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="staff-id">Staff ID</label>
        <input id="staff-id" autoComplete="username" required value={staffId} onChange={(event) => setStaffId(event.target.value)} style={{ display: "block", width: "100%", boxSizing: "border-box", padding: 12, margin: "6px 0 16px" }} />
        <label htmlFor="staff-password">Password</label>
        <input id="staff-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} style={{ display: "block", width: "100%", boxSizing: "border-box", padding: 12, margin: "6px 0 16px" }} />
        {error && <p role="alert" style={{ color: "#b91c1c" }}>{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
    </main>
  );
}

export default StaffAccess;
