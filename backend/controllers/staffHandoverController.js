const StaffHandover = require("../models/StaffHandover");

// Get all handovers
const getHandovers = async (req, res) => {
  try {
    const handovers = await StaffHandover.find().sort({ createdAt: -1 });
    res.status(200).json(handovers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a handover
const createHandover = async (req, res) => {
  try {
    const handover = await StaffHandover.create(req.body);
    res.status(201).json(handover);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update handover
const updateHandover = async (req, res) => {
  try {
    const handover = await StaffHandover.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!handover) {
      return res.status(404).json({ message: "Handover not found" });
    }

    res.status(200).json(handover);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete handover
const deleteHandover = async (req, res) => {
  try {
    const handover = await StaffHandover.findByIdAndDelete(req.params.id);

    if (!handover) {
      return res.status(404).json({ message: "Handover not found" });
    }

    res.status(200).json({ message: "Handover deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHandovers,
  createHandover,
  updateHandover,
  deleteHandover,
};