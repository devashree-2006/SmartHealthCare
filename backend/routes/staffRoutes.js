
const express = require("express");
const router = express.Router();
const requireRole = require("../middleware/authMiddleware");

router.use(requireRole("admin"));

const {
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff,
} = require("../controllers/staffController");

// View all staff and add staff
router.route("/")
  .get(getStaff)
  .post(addStaff);

// Update and delete staff
router.route("/:id")
  .put(updateStaff)
  .delete(deleteStaff);

module.exports = router;
