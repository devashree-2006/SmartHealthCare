
const express = require("express");

const {
  getStaffTransfers,
  addStaffTransfer,
  updateStaffTransfer,
  deleteStaffTransfer,
} = require("../controllers/staffTransferController");

const router = express.Router();
const requireRole = require("../middleware/authMiddleware");

router.use(requireRole("staff", "admin"));

// Get all staff transfers
router.get("/", getStaffTransfers);

// Create a new transfer
router.post("/", addStaffTransfer);

// Update a transfer
router.put("/:id", updateStaffTransfer);

// Delete a transfer
router.delete("/:id", deleteStaffTransfer);

module.exports = router;
