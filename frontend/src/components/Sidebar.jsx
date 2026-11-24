
function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { name: "Dashboard", icon: "dashboard" },
    { name: "Bed Management", icon: "bed" },
    { name: "Staff Management", icon: "staff" },
    { name: "Resource Analytics", icon: "analytics" },
    { name: "Bottleneck Alerts", icon: "alert" },
    { name: "Activity Log", icon: "activity" },
  ];

  const icons = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    bed: (
      <>
        <path d="M3 18V6" />
        <path d="M3 15h18v5" />
        <path d="M3 11h18a2 2 0 0 1 2 2v2" />
        <path d="M7 11V8a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3" />
      </>
    ),
    staff: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    analytics: (
      <>
        <path d="M3 3v18h18" />
        <path d="m19 9-5 5-4-4-5 5" />
      </>
    ),
    alert: (
      <>
        <path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
    activity: (
      <>
        <path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2" />
        <path d="M8 2h8v4H8z" />
        <path d="M8 12h8M8 16h8" />
      </>
    ),
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">
          <svg
            viewBox="0 0 24 24"
            width="25"
            height="25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </div>

        <div>
          <h2>CareSync</h2>
          <p>Smart Healthcare</p>
        </div>
      </div>

      <p className="sidebar-label">ADMIN MENU</p>

      <nav className="sidebar-nav" aria-label="Admin navigation">
        {menuItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`sidebar-link ${
              activeSection === item.name ? "active" : ""
            }`}
            onClick={() => setActiveSection(item.name)}
            aria-current={
              activeSection === item.name ? "page" : undefined
            }
          >
            <span className="sidebar-icon">
              <svg
                viewBox="0 0 24 24"
                width="21"
                height="21"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                {icons[item.icon]}
              </svg>
            </span>

            <span>{item.name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="online-dot" />
        <span>System Online</span>
      </div>
    </aside>
  );
}

export default Sidebar;
