import { apiRequest } from "./api";

const request = (path, method = "GET", body) => apiRequest(path, {
  method,
  ...(body === undefined ? {} : { body: JSON.stringify(body) }),
});

export const getAdminDashboardStats = () => request("/admin/stats");
export const getBeds = () => request("/beds");
export const getStaff = () => request("/staff");
export const getBottleneckAlerts = () => request("/admin/alerts");
export const createManualAlert = (data) => request("/admin/alerts", "POST", data);
export const deleteManualAlert = (id) => request(`/admin/alerts/manual/${id}`, "DELETE");
export const addBed = (data) => request("/beds", "POST", data);
export const updateBed = (id, data) => request(`/beds/${id}`, "PUT", data);
export const deleteBed = (id) => request(`/beds/${id}`, "DELETE");
export const addStaff = (data) => request("/staff", "POST", data);
export const updateStaff = (id, data) => request(`/staff/${id}`, "PUT", data);
export const deleteStaff = (id) => request(`/staff/${id}`, "DELETE");
export const getActivityLogs = () => request("/activity-logs");
