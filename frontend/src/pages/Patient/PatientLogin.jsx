
import { useState } from "react";
import { apiRequest } from "../../services/api";
import "../../App.css";

function PatientLogin({ onLogin, onGoToRegister, onGoToPortal }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = await apiRequest("/patients/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      onLogin(data.patient);
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>CareSync</h1>
      <h2>Patient Login</h2>
      <p>Welcome back! Please log in to continue.</p>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onGoToRegister}
        >
          Register
        </button>
      </p>
      {onGoToPortal && <button type="button" onClick={onGoToPortal}>Choose another portal</button>}
    </div>
  );
}

export default PatientLogin;
