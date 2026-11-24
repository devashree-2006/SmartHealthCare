
const API_BASE_URL = "http://127.0.0.1:5001/api";

// Fetch Admin Dashboard Statistics
export const getAdminDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/stats`);

    if (!response.ok) {
      throw new Error("Failed to fetch Admin Dashboard statistics");
    }

    return await response.json();
  } catch (error) {
    console.error("Admin Dashboard API Error:", error);
    throw error;
  }
};

// Fetch all beds from MongoDB
export const getBeds = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/beds`);

    if (!response.ok) {
      throw new Error("Failed to fetch beds");
    }

    return await response.json();
  } catch (error) {
    console.error("Bed API Error:", error);
    throw error;
  }
};

// Fetch all staff from MongoDB
export const getStaff = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/staff`);

    if (!response.ok) {
      throw new Error("Failed to fetch staff");
    }

    return await response.json();
  } catch (error) {
    console.error("Staff API Error:", error);
    throw error;
  }
};

// Fetch Bottleneck Alerts from MongoDB
export const getBottleneckAlerts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/alerts`);

    if (!response.ok) {
      throw new Error("Failed to fetch Bottleneck Alerts");
    }

    return await response.json();
  } catch (error) {
    console.error("Bottleneck Alerts API Error:", error);
    throw error;
  }
};

// Create a manual bottleneck alert
export const createManualAlert = async (alertData) => {
  const response = await fetch(`${API_BASE_URL}/admin/alerts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(alertData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create manual alert");
  }

  return await response.json();
};

// Delete a manual bottleneck alert
export const deleteManualAlert = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/admin/alerts/manual/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete manual alert");
  }

  return await response.json();
};

// Add a new bed
export const addBed = async (bedData) => {
  const response = await fetch(`${API_BASE_URL}/beds`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add bed");
  }

  return await response.json();
};

// Update an existing bed
export const updateBed = async (id, bedData) => {
  const response = await fetch(`${API_BASE_URL}/beds/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bedData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update bed");
  }

  return await response.json();
};

// Delete a bed
export const deleteBed = async (id) => {
  const response = await fetch(`${API_BASE_URL}/beds/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete bed");
  }

  return await response.json();
};

// Add a new staff member
export const addStaff = async (staffData) => {
  const response = await fetch(`${API_BASE_URL}/staff`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staffData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add staff");
  }

  return await response.json();
};

// Update an existing staff member
export const updateStaff = async (id, staffData) => {
  const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(staffData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update staff");
  }

  return await response.json();
};

// Delete a staff member
export const deleteStaff = async (id) => {
  const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete staff");
  }

  return await response.json();
};

// Fetch Admin Activity Logs from MongoDB
export const getActivityLogs = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/activity-logs`);

    if (!response.ok) {
      throw new Error("Failed to fetch Activity Logs");
    }

    return await response.json();
  } catch (error) {
    console.error("Activity Logs API Error:", error);
    throw error;
  }
};
