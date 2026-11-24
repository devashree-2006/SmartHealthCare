
const Staff = require("../models/Staff");
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
    const { staffId, name, role, department, shift, status } = req.body;

    if (!staffId || !name || !role || !department || !shift) {
      return res.status(400).json({
        message: "Please provide all required staff details",
      });
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
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
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
