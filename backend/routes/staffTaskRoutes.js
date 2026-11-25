
const express = require("express");

const {
  getStaffTasks,
  addStaffTask,
  updateStaffTask,
  deleteStaffTask,
} = require("../controllers/staffTaskController");

const router = express.Router();
const requireRole = require("../middleware/authMiddleware");

router.use(requireRole("staff", "admin"));

// Get all staff tasks
router.get("/", getStaffTasks);

// Add a staff task
router.post("/", addStaffTask);

// Update a staff task
router.put("/:id", updateStaffTask);

// Delete a staff task
router.delete("/:id", deleteStaffTask);

module.exports = router;
