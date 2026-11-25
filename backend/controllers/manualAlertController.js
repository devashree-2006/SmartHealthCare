const ManualAlert = require("../models/ManualAlert");

// Create a manual alert
const createManualAlert = async (req, res) => {
  try {
    const { title, department, severity, description, status } = req.body;

    if (!title || !department || !severity || !description) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    const newAlert = await ManualAlert.create({
      title,
      department,
      severity,
      description,
      status: status || "Active",
    });

    res.status(201).json({
      message: "Manual alert created successfully",
      alert: {
        id: newAlert._id.toString(),
        title: newAlert.title,
        department: newAlert.department,
        severity: newAlert.severity,
        description: newAlert.description,
        status: newAlert.status,
        time: newAlert.createdAt.toISOString(),
        source: "Manual",
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a manual alert
const deleteManualAlert = async (req, res) => {
  try {
    const deletedAlert = await ManualAlert.findByIdAndDelete(req.params.id);

    if (!deletedAlert) {
      return res.status(404).json({
        message: "Manual alert not found",
      });
    }

    res.status(200).json({
      message: "Manual alert deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createManualAlert,
  deleteManualAlert,
};