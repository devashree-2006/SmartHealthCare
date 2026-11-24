const express = require("express");
const router = express.Router();
const requireRole = require("../middleware/authMiddleware");

router.use(requireRole("admin"));

const {
  getDashboardStats,
  getBottleneckAlerts,
} = require("../controllers/adminController");

const {
  createManualAlert,
  deleteManualAlert,
} = require("../controllers/manualAlertController");

// Admin Dashboard Statistics
router.get("/stats", getDashboardStats);

// Admin Bottleneck Alerts
router.get("/alerts", getBottleneckAlerts);

// Create Manual Alert
router.post("/alerts", createManualAlert);

// Delete Manual Alert
router.delete("/alerts/manual/:id", deleteManualAlert);

module.exports = router;
