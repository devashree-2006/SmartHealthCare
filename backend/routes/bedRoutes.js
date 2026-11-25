
const express = require("express");
const router = express.Router();
const requireRole = require("../middleware/authMiddleware");

router.use(requireRole("admin"));

const {
  getBeds,
  addBed,
  updateBed,
  deleteBed,
} = require("../controllers/bedController");

// Get all beds and add a new bed
router.route("/")
  .get(getBeds)
  .post(addBed);

// Update and delete a bed by ID
router.route("/:id")
  .put(updateBed)
  .delete(deleteBed);

module.exports = router;
