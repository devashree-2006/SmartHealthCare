
const express = require("express");
const router = express.Router();
const requireRole = require("../middleware/authMiddleware");

router.use(requireRole("admin"));

const {
  getActivityLogs,
} = require("../controllers/activityLogController");

router.get("/", getActivityLogs);

module.exports = router;
