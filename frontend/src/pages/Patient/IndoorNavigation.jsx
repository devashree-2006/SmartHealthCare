
import React, { useMemo, useState } from "react";

const destinations = [
  {
    id: 1,
    name: "Emergency Department",
    category: "Emergency",
    floor: "Ground Floor",
    room: "G-001",
    icon: "🚑",
    description: "Emergency and urgent medical assistance.",
    directions: [
      "Start at the main entrance.",
      "Follow the red Emergency signs.",
      "Continue to the Emergency reception.",
    ],
    accessible: true,
  },
  {
    id: 2,
    name: "Registration & Reception",
    category: "Services",
    floor: "Ground Floor",
    room: "G-010",
    icon: "🛎️",
    description: "Patient registration and visitor assistance.",
    directions: [
      "Enter through the main entrance.",
      "Walk straight towards the reception desk.",
      "Join the registration queue.",
    ],
    accessible: true,
  },
  {
    id: 3,
    name: "Pharmacy",
    category: "Services",
    floor: "Ground Floor",
    room: "G-015",
    icon: "💊",
    description: "Medicine collection and pharmacy assistance.",
    directions: [
      "Start at the main reception.",
      "Follow the signs marked Pharmacy.",
      "Look for room G-015.",
    ],
    accessible: true,
  },
  {
    id: 4,
    name: "Laboratory",
    category: "Diagnostics",
    floor: "First Floor",
    room: "F-105",
    icon: "🧪",
    description: "Sample collection and diagnostic tests.",
    directions: [
      "Start at the main reception.",
      "Use the lift or stairs to the first floor.",
      "Follow the Laboratory signs to room F-105.",
    ],
    accessible: true,
  },
  {
    id: 5,
    name: "Cardiology",
    category: "Departments",
    floor: "Second Floor",
    room: "S-204",
    icon: "❤️",
    description: "Heart health consultations and examinations.",
    directions: [
      "Start at the main reception.",
      "Take the lift to the second floor.",
      "Follow the Cardiology signs to room S-204.",
    ],
    accessible: true,
  },
  {
    id: 6,
    name: "General Medicine",
    category: "Departments",
    floor: "First Floor",
    room: "F-112",
    icon: "🩺",
    description: "General consultations and health checkups.",
    directions: [
      "Start at the main reception.",
      "Go to the first floor using the lift or stairs.",
      "Follow the General Medicine signs to room F-112.",
    ],
    accessible: true,
  },
  {
    id: 7,
    name: "Radiology & Imaging",
    category: "Diagnostics",
    floor: "Ground Floor",
    room: "G-025",
    icon: "🩻",
    description: "X-ray and diagnostic imaging services.",
    directions: [
      "Start at the main reception.",
      "Follow the Diagnostic Imaging signs.",
      "Look for room G-025.",
    ],
    accessible: true,
  },
  {
    id: 8,
    name: "Patient Rooms",
    category: "Patient Care",
    floor: "Third Floor",
    room: "Rooms 301–320",
    icon: "🛏️",
    description: "Inpatient wards and patient rooms.",
    directions: [
      "Start at the main reception.",
      "Take the lift to the third floor.",
      "Check the ward directory for your assigned room.",
    ],
    accessible: true,
  },
];

const categories = [
  "All Locations",
  "Emergency",
  "Services",
  "Diagnostics",
  "Departments",
  "Patient Care",
];

function IndoorNavigation() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Locations");
  const [selected, setSelected] = useState(null);
  const [accessibleOnly, setAccessibleOnly] = useState(false);

  const filteredDestinations = useMemo(() => {
    const query = search.toLowerCase().trim();

    return destinations.filter((place) => {
      const matchesCategory =
        category === "All Locations" || place.category === category;

      const matchesSearch =
        place.name.toLowerCase().includes(query) ||
        place.floor.toLowerCase().includes(query) ||
        place.room.toLowerCase().includes(query) ||
        place.category.toLowerCase().includes(query);

      const matchesAccessibility =
        !accessibleOnly || place.accessible;

      return matchesCategory && matchesSearch && matchesAccessibility;
    });
  }, [search, category, accessibleOnly]);

  return (
    <div className="patient-dashboard indoor-navigation-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">HOSPITAL WAYFINDING</p>
          <h1>Indoor Navigation</h1>
          <p className="subtitle">
            Find hospital departments and important services.
          </p>
        </div>
        <div className="patient-avatar">🧭</div>
      </div>

      <section className="welcome-card">
        <div>
          <p className="welcome-label">FIND YOUR WAY</p>
          <h2>Where do you need to go?</h2>
          <p>
            Search for a location and view its floor, room, and sample
            directions.
          </p>
        </div>
        <span className="welcome-icon">⌖</span>
      </section>

      <section className="navigation-search-panel">
        <label htmlFor="hospital-search">Search hospital locations</label>
        <div className="navigation-search">
          <span>⌕</span>
          <input
            id="hospital-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try Emergency, Pharmacy, or First Floor..."
          />
        </div>

        <div className="navigation-filter-row">
          <label className="navigation-accessibility">
            <input
              type="checkbox"
              checked={accessibleOnly}
              onChange={(event) => setAccessibleOnly(event.target.checked)}
            />
            Show accessibility-marked locations
          </label>
        </div>
      </section>

      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <h2>Explore locations</h2>
            <p>
              {filteredDestinations.length} location
              {filteredDestinations.length === 1 ? "" : "s"} found
            </p>
          </div>
        </div>

        <div className="navigation-category-list">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`navigation-category ${
                category === item ? "active" : ""
              }`}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filteredDestinations.length === 0 ? (
          <div className="empty-state">
            <span>🔎</span>
            <h3>No locations found</h3>
            <p>Try a different search or category.</p>
            <button
              className="secondary-button"
              type="button"
              onClick={() => {
                setSearch("");
                setCategory("All Locations");
                setAccessibleOnly(false);
              }}
            >
              Reset search
            </button>
          </div>
        ) : (
          <div className="navigation-grid">
            {filteredDestinations.map((place) => (
              <article className="navigation-card" key={place.id}>
                <div className="navigation-card-top">
                  <div className="navigation-icon">{place.icon}</div>
                  <span className="navigation-category-tag">
                    {place.category}
                  </span>
                </div>

                <h3>{place.name}</h3>
                <p>{place.description}</p>

                <div className="navigation-location-info">
                  <span>📍 {place.floor}</span>
                  <span>🚪 {place.room}</span>
                </div>

                {place.accessible && (
                  <span className="accessibility-badge">
                    ♿ Accessibility marked
                  </span>
                )}

                <button
                  type="button"
                  className="primary-button navigation-details-button"
                  onClick={() => setSelected(place)}
                >
                  View directions
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {selected && (
        <div
          className="record-modal navigation-modal"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelected(null);
            }
          }}
        >
          <div
            className="record-modal-content"
            role="dialog"
            aria-modal="true"
            aria-labelledby="navigation-modal-title"
          >
            <button
              type="button"
              className="modal-close"
              aria-label="Close directions"
              onClick={() => setSelected(null)}
            >
              ×
            </button>

            <p className="eyebrow">LOCATION DIRECTIONS</p>
            <div className="navigation-modal-heading">
              <span className="navigation-icon">{selected.icon}</span>
              <div>
                <h2 id="navigation-modal-title">{selected.name}</h2>
                <p>{selected.floor} · Room {selected.room}</p>
              </div>
            </div>

            <div className="navigation-start-point">
              <span>📍</span>
              <div>
                <strong>Starting point: Main entrance</strong>
                <p>Follow the steps below as a sample route.</p>
              </div>
            </div>

            <ol className="direction-steps">
              {selected.directions.map((step, index) => (
                <li key={`${selected.id}-${index}`}>
                  <span>{index + 1}</span>
                  <p>{step}</p>
                </li>
              ))}
            </ol>

            <p className="navigation-demo-warning">
              Demo directions only. Floor numbers, room codes, routes, and
              accessibility information must be verified against the actual
              hospital layout before real-world use.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => setSelected(null)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <p className="demo-note">
        Prototype only · This page does not track your live position or
        calculate a real indoor route.
      </p>
    </div>
  );
}

export default IndoorNavigation;
