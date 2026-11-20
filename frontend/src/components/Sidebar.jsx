
function Sidebar({ activeSection, setActiveSection }) {
  const menuItems = [
    { name: "Dashboard", icon: "⌂" },
    { name: "Bed Management", icon: "🛏️" },
    { name: "Staff Management", icon: "👥" },
    { name: "Resource Analytics", icon: "📊" },
    { name: "Bottleneck Alerts", icon: "⚠️" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon">✚</div>
        <div>
          <h2>CareSync</h2>
          <p>Smart Healthcare</p>
        </div>
      </div>

      <p className="sidebar-label">ADMIN MENU</p>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.name}
            type="button"
            className={`sidebar-link ${
              activeSection === item.name ? "active" : ""
            }`}
            onClick={() => setActiveSection(item.name)}
          >
            <span className="sidebar-icon">{item.icon}</span>
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
