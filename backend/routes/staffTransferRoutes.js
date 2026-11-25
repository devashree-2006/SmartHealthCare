
const express = require("express");

const {
  getStaffTransfers,
  addStaffTransfer,
  updateStaffTransfer,
  deleteStaffTransfer,
} = require("../controllers/staffTransferController");

const router = express.Router();

// Get all staff transfers
router.get("/", getStaffTransfers);

// Create a new transfer
router.post("/", addStaffTransfer);

// Update a transfer
router.put("/:id", updateStaffTransfer);

// Delete a transfer
router.delete("/:id", deleteStaffTransfer);

module.exports = router;
