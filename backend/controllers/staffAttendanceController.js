const StaffAttendance = require("../models/StaffAttendance");

// Get all attendance records
const getAttendance = async (req, res) => {
  try {
    const records = await StaffAttendance.find().sort({ createdAt: -1 });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create attendance record
const createAttendance = async (req, res) => {
  try {
    const { date, checkIn, checkOut, status } = req.body;

    const record = await StaffAttendance.create({
      date,
      checkIn,
      checkOut,
      status: status || "Present",
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update attendance record
const updateAttendance = async (req, res) => {
  try {
    const record = await StaffAttendance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }

    res.status(200).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAttendance,
  createAttendance,
  updateAttendance,
};