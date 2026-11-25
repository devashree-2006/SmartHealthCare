
const StaffTask = require("../models/StaffTask");

// Get all staff tasks
const getStaffTasks = async (req, res) => {
  try {
    const tasks = await StaffTask.find().sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a new staff task
const addStaffTask = async (req, res) => {
  try {
    const { title, department, priority, status, due } = req.body;

    const task = await StaffTask.create({
      title,
      department,
      priority,
      status,
      due,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a staff task
const updateStaffTask = async (req, res) => {
  try {
    const task = await StaffTask.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Staff task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a staff task
const deleteStaffTask = async (req, res) => {
  try {
    const task = await StaffTask.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Staff task not found" });
    }

    res.status(200).json({ message: "Staff task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getStaffTasks,
  addStaffTask,
  updateStaffTask,
  deleteStaffTask,
};
