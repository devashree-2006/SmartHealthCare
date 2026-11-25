
const StaffTransfer = require("../models/StaffTransfer");

// Get all staff transfers
const getStaffTransfers = async (req, res) => {
  try {
    const transfers = await StaffTransfer.find().sort({ createdAt: -1 });
    res.status(200).json(transfers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a staff transfer
const addStaffTransfer = async (req, res) => {
  try {
    const { patient, from, to, reason, priority, status, time } = req.body;

    if (from === to) {
      return res.status(400).json({
        message: "Source and destination wards must be different.",
      });
    }

    const transfer = await StaffTransfer.create({
      patient,
      from,
      to,
      reason,
      priority,
      status,
      time,
    });

    res.status(201).json(transfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update transfer status
const updateStaffTransfer = async (req, res) => {
  try {
    const transfer = await StaffTransfer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!transfer) {
      return res.status(404).json({
        message: "Staff transfer not found",
      });
    }

    res.status(200).json(transfer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a staff transfer
const deleteStaffTransfer = async (req, res) => {
  try {
    const transfer = await StaffTransfer.findByIdAndDelete(req.params.id);

    if (!transfer) {
      return res.status(404).json({
        message: "Staff transfer not found",
      });
    }

    res.status(200).json({
      message: "Staff transfer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStaffTransfers,
  addStaffTransfer,
  updateStaffTransfer,
  deleteStaffTransfer,
};
