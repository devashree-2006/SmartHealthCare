
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";

import PatientDashboard from "./pages/Patient/PatientDashboard";
import Appointments from "./pages/Patient/Appointments";
import MedicalRecords from "./pages/Patient/MedicalRecords";
import IndoorNavigation from "./pages/Patient/IndoorNavigation";
import PatientFeedback from "./pages/Patient/PatientFeedback";
import EmergencySupport from "./pages/Patient/EmergencySupport";
import PatientProfile from "./pages/Patient/PatientProfile";

import PatientLogin from "./pages/Patient/PatientLogin";
import PatientRegister from "./pages/Patient/PatientRegister";
import DoctorDashboard from "./pages/Doctor/DoctorDashboard";
import DoctorAccess from "./pages/Doctor/DoctorAccess";

import { apiRequest } from "./services/api";


import "./App.css";



// SIDEBAR MENU
const menuItems = [
  { path: "/", label: "dashboard", icon: "⌂" },
  { path: "/profile", label: "profile", icon: "👤" },
  { path: "/appointments", label: "appointments", icon: "▦" },
  { path: "/records", label: "records", icon: "▤" },
  { path: "/navigation", label: "navigation", icon: "⌖" },
  { path: "/feedback", label: "feedback", icon: "♡" },
  { path: "/emergency", label: "emergency", icon: "🚑" },
];

// PATIENT DASHBOARD LAYOUT
function AppLayout({ user, onLogout }) {
  const { t, i18n } = useTranslation();

  const changeLanguage = (event) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <div className="app-container">
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">✚</div>
          <div>
            <h2>CareSync</h2>
            <p>Smart Healthcare</p>
          </div>
        </div>

        <p className="nav-heading">{t("patientMenu")}</p>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/"}
              className={({ isActive }) =>
                `nav-item ${isActive ? "active" : ""}`
              }
            >
              <span>{item.icon}</span>
              {t(item.label)}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-help">
          <span>💙</span>
          <h3>Need assistance?</h3>
          <p>
            We're here to help you navigate your healthcare journey.
          </p>
        </div>

        <div className="sidebar-profile">
          <div className="profile-avatar">
            {user?.fullName?.charAt(0)?.toUpperCase() || "P"}
          </div>

          <div>
            <h4>{user?.fullName || "Patient"}</h4>
            <p>Patient account</p>
          </div>
        </div>

        <button type="button" onClick={onLogout}>
          Logout
        </button>

      </aside>

      <main className="main-content">

        <div className="topbar">
          <div className="breadcrumb">
            CareSync / Patient Portal
          </div>

          <div className="topbar-right">
            <span className="online-dot"></span>

            <label className="language-selector">
              <span>🌐</span>

              <select
                aria-label={t("language")}
                value={i18n.resolvedLanguage || "en"}
                onChange={changeLanguage}
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
              </select>
            </label>

            <span>{t("healthcareTagline")}</span>
          </div>
        </div>

        <Routes>
          <Route path="/" element={<PatientDashboard />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/records" element={<MedicalRecords />} />
          <Route path="/navigation" element={<IndoorNavigation />} />
          <Route path="/feedback" element={<PatientFeedback />} />
          <Route path="/emergency" element={<EmergencySupport />} />
          <Route path="/profile" element={<PatientProfile />} />
        </Routes>

      </main>
    </div>
  );
}


// MAIN APP
function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [selectedPortal, setSelectedPortal] = useState(null);

  // Restore either role from the same server-side session.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const currentUser = await apiRequest("/auth/me");
        setUser(currentUser);
        setSelectedPortal(currentUser.role);
      } catch {
        setUser(null);
      } finally {
        setCheckingAuth(false);
      }
    };

    restoreSession();
  }, []);

  const handleLogout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
      setUser(null);
      setShowRegister(false);
      setSelectedPortal(null);
    } catch (error) {
      console.error("Logout failed:", error.message);
      alert("Unable to logout. Please try again.");
    }
  };

  return (
    <BrowserRouter>
      {checkingAuth ? <div>Loading CareSync...</div> :
        user?.role === "patient" ? <AppLayout user={user} onLogout={handleLogout} /> :
        user?.role === "doctor" ? <DoctorDashboard onLogout={handleLogout} /> :
        selectedPortal === "patient" ? (
          showRegister
            ? <PatientRegister onRegister={setUser} onGoToLogin={() => setShowRegister(false)} onGoToPortal={() => { setSelectedPortal(null); setShowRegister(false); }} />
            : <PatientLogin onLogin={setUser} onGoToRegister={() => setShowRegister(true)} onGoToPortal={() => setSelectedPortal(null)} />
        ) :
        selectedPortal === "doctor" ? (
          <DoctorAccess onLogin={setUser} onBack={() => setSelectedPortal(null)} />
        ) : (
          <div className="login-container">
            <h1>CareSync</h1>
            <p>Choose your portal to continue.</p>
            <button type="button" onClick={() => setSelectedPortal("patient")}>Patient Portal</button>
            <button type="button" onClick={() => setSelectedPortal("doctor")}>Doctor Portal</button>
          </div>
        )}
    </BrowserRouter>
  );
}

export default App;
