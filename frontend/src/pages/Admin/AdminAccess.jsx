import { useState } from "react";
import { apiRequest } from "../../services/api";

function AdminAccess({ onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const admin = await apiRequest("/auth/admin-login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      onLogin(admin);
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-container">
      <h1>Admin sign in</h1>
      <p>Use the administrator account configured for this server.</p>
      <form onSubmit={submit}>
        <label htmlFor="admin-email">Email</label>
        <input id="admin-email" type="email" autoComplete="username" value={email}
          onChange={(event) => setEmail(event.target.value)} required />
        <label htmlFor="admin-password">Password</label>
        <input id="admin-password" type="password" autoComplete="current-password" value={password}
          onChange={(event) => setPassword(event.target.value)} required />
        {error && <p role="alert">{error}</p>}
        <button type="submit" disabled={loading}>{loading ? "Signing in…" : "Sign in"}</button>
      </form>
      <button type="button" onClick={onBack}>Back to portal selection</button>
    </main>
  );
}

export default AdminAccess;
