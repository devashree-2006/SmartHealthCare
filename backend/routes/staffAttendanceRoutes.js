const express = require("express");
const router = express.Router();
const requireRole = require("../middleware/authMiddleware");

router.use(requireRole("staff", "admin"));

const {
  getAttendance,
  createAttendance,
  updateAttendance,
} = require("../controllers/staffAttendanceController");

router.get("/", getAttendance);
router.post("/", createAttendance);
router.put("/:id", updateAttendance);

module.exports = router;
