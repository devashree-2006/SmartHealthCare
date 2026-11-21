
import React, { useState } from "react";

const initialProfile = {
  fullName: "Aarav Sharma",
  patientId: "PAT-1001",
  dateOfBirth: "2002-06-15",
  gender: "Male",
  bloodGroup: "O+",
  phone: "9876543210",
  email: "aarav@example.com",
  address: "Belagavi, Karnataka, India",
  emergencyName: "Priya Sharma",
  emergencyPhone: "9876501234",
  relationship: "Family member",
};

function PatientProfile() {
  const [profile, setProfile] = useState(initialProfile);
  const [formData, setFormData] = useState(initialProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSave = (event) => {
    event.preventDefault();

    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setMessage("Please enter your name and phone number.");
      return;
    }

    setProfile({ ...formData });
    setIsEditing(false);
    setMessage("Profile updated successfully!");
  };

  const handleCancel = () => {
    setFormData({ ...profile });
    setIsEditing(false);
    setMessage("");
  };

  const fields = [
    { name: "fullName", label: "Full name", type: "text" },
    { name: "dateOfBirth", label: "Date of birth", type: "date" },
    { name: "gender", label: "Gender", type: "select",
      options: ["Male", "Female", "Other", "Prefer not to say"] },
    { name: "bloodGroup", label: "Blood group", type: "select",
      options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
    { name: "phone", label: "Phone number", type: "tel" },
    { name: "email", label: "Email address", type: "email" },
    { name: "address", label: "Home address", type: "text" },
    { name: "emergencyName", label: "Emergency contact name", type: "text" },
    { name: "emergencyPhone", label: "Emergency contact phone", type: "tel" },
    { name: "relationship", label: "Relationship", type: "text" },
  ];

  return (
    <div className="patient-dashboard profile-page">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">PATIENT ACCOUNT</p>
          <h1>My Profile</h1>
          <p className="subtitle">
            View and manage your personal information.
          </p>
        </div>
        <div className="patient-avatar">👤</div>
      </div>

      <section className="profile-summary-card">
        <div className="profile-large-avatar">
          {profile.fullName.trim().charAt(0).toUpperCase() || "P"}
        </div>
        <div className="profile-summary-info">
          <h2>{profile.fullName}</h2>
          <p>Patient ID: {profile.patientId}</p>
          <span className="profile-status">Patient account</span>
        </div>
        {!isEditing && (
          <button
            className="profile-edit-button"
            onClick={() => {
              setFormData({ ...profile });
              setIsEditing(true);
              setMessage("");
            }}
          >
            ✎ Edit Profile
          </button>
        )}
      </section>

      {message && (
        <p className="profile-message" role="status">{message}</p>
      )}

      <form className="profile-form" onSubmit={handleSave}>
        <section className="profile-section">
          <div className="profile-section-heading">
            <span>👤</span>
            <div>
              <h2>Personal Information</h2>
              <p>Your basic identity details</p>
            </div>
          </div>

          <div className="profile-fields-grid">
            {fields.slice(0, 4).map((field) => (
              <label className="profile-field" key={field.name}>
                {field.label}
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={!isEditing}
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    type={field.type}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={!isEditing}
                  />
                )}
              </label>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <span>✉️</span>
            <div>
              <h2>Contact Information</h2>
              <p>How to reach you</p>
            </div>
          </div>

          <div className="profile-fields-grid">
            {fields.slice(4, 7).map((field) => (
              <label className="profile-field" key={field.name}>
                {field.label}
                <input
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required={field.name === "phone"}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="profile-section">
          <div className="profile-section-heading">
            <span>🚨</span>
            <div>
              <h2>Emergency Contact</h2>
              <p>Person to contact if you need assistance</p>
            </div>
          </div>

          <div className="profile-fields-grid">
            {fields.slice(7).map((field) => (
              <label className="profile-field" key={field.name}>
                {field.label}
                <input
                  name={field.name}
                  type={field.type}
                  value={formData[field.name]}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </label>
            ))}
          </div>
        </section>

        {isEditing && (
          <div className="profile-form-actions">
            <button
              className="profile-cancel-button"
              type="button"
              onClick={handleCancel}
            >
              Cancel
            </button>
            <button className="profile-save-button" type="submit">
              Save Changes
            </button>
          </div>
        )}
      </form>

      <p className="demo-note">
        Demo profile · Sample information only · Changes are not stored
        permanently.
      </p>
    </div>
  );
}

export default PatientProfile;
