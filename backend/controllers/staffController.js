
const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");
const logActivity = require("../utils/logActivity");

// Get all staff
const getStaff = async (req, res) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new staff
const addStaff = async (req, res) => {
  try {
    const { staffId, name, role, department, shift, status, password } = req.body;

    if (!staffId || !name || !role || !department || !shift || !password) {
      return res.status(400).json({
        message: "Please provide all required staff details and a sign-in password",
      });
    }
    if (password.length < 8) {
      return res.status(400).json({ message: "Staff passwords must be at least 8 characters." });
    }

    const existingStaff = await Staff.findOne({ staffId });

    if (existingStaff) {
      return res.status(409).json({
        message: "Staff ID already exists",
      });
    }

    const staff = await Staff.create({
      staffId,
      name,
      role,
      department,
      shift,
      status,
      passwordHash: await bcrypt.hash(password, 12),
    });

    await logActivity({
      action: "CREATE",
      module: "Staff Management",
      description: `Added staff member with ID ${staff.staffId}`,
      recordId: staff._id.toString(),
    });

    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update staff
const updateStaff = async (req, res) => {
  try {
    const { password, ...staffDetails } = req.body;
    const update = { ...staffDetails };
    if (password) {
      if (password.length < 8) {
        return res.status(400).json({ message: "Staff passwords must be at least 8 characters." });
      }
      update.passwordHash = await bcrypt.hash(password, 12);
    }
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true, runValidators: true }
    );

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    await logActivity({
      action: "UPDATE",
      module: "Staff Management",
      description: `Updated staff member with ID ${staff.staffId}`,
      recordId: staff._id.toString(),
    });

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete staff
const deleteStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({
        message: "Staff member not found",
      });
    }

    await logActivity({
      action: "DELETE",
      module: "Staff Management",
      description: `Deleted staff member with ID ${staff.staffId}`,
      recordId: staff._id.toString(),
    });

    res.status(200).json({
      message: "Staff member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStaff,
  addStaff,
  updateStaff,
  deleteStaff,
};
