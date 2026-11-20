
import { useState } from "react";
import "./App.css";
import AdminDashboard from "./src/pages/Admin/AdminDashboard";

function LoginPage({ onLogin }) {
  const [role, setRole] = useState("Patient");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");

  function handleLogin(event) {
    event.preventDefault();
    setMessage("");

    // Temporary frontend navigation.
    // Real authentication will be connected to the backend later.
    if (role === "Admin") {
      onLogin();
    } else {
      setMessage(
        `${role} dashboard will be connected when its module is ready.`
      );
    }
  }

  return (
    <div className="login-page">
      <section className="login-visual">
        <div className="visual-top">
          <div className="brand-logo">+</div>
          <span>CareSync</span>
        </div>

        <div className="visual-content">
          <p className="visual-label">SMART HEALTHCARE PLATFORM</p>

          <h1>
            Better Healthcare.
            <br />
            <span>Connected Care.</span>
          </h1>

          <p className="visual-description">
            A unified digital healthcare platform designed
            to connect patients, doctors and healthcare
            professionals through smarter technology.
          </p>

          <div className="visual-highlight">
            <div className="highlight-icon">✚</div>
            <div>
              <strong>One Platform. Complete Care.</strong>
              <p>Healthcare management, simplified.</p>
            </div>
          </div>
        </div>

        <div className="visual-bottom">
          <span>Secure Healthcare Management</span>
          <span>© 2026 CareSync</span>
        </div>

        <div className="visual-decoration decoration-one"></div>
        <div className="visual-decoration decoration-two"></div>
      </section>

      <section className="login-form-section">
        <div className="login-card">
          <div className="form-heading">
            <p className="form-eyebrow">WELCOME TO CARESYNC</p>
            <h2>Sign in to your account</h2>
            <p>Enter your credentials to access your portal.</p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="login-role">Account type</label>
              <select
                id="login-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-label">
                <label htmlFor="login-password">Password</label>
              </div>

              <div className="password-field">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {message && (
              <p className="login-message">{message}</p>
            )}

            <button type="submit" className="login-button">
              Sign In <span>→</span>
            </button>
          </form>

          <div className="login-security">
            <span>◇</span>
            Secure access to your healthcare portal
          </div>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) {
    return <AdminDashboard />;
  }

  return <LoginPage onLogin={() => setLoggedIn(true)} />;
}

export default App;
