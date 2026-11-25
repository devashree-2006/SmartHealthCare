
const Bed = require("../models/Bed");
const Staff = require("../models/Staff");
const ManualAlert = require("../models/ManualAlert");

// Get Admin Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalBeds,
      availableBeds,
      occupiedBeds,
      totalStaff,
      onDutyStaff,
      offDutyStaff,
    ] = await Promise.all([
      Bed.countDocuments(),
      Bed.countDocuments({ status: "Available" }),
      Bed.countDocuments({ status: "Occupied" }),
      Staff.countDocuments(),
      Staff.countDocuments({ status: "On Duty" }),
      Staff.countDocuments({ status: "Off Duty" }),
    ]);

    res.status(200).json({
      beds: {
        total: totalBeds,
        available: availableBeds,
        occupied: occupiedBeds,
      },
      staff: {
        total: totalStaff,
        onDuty: onDutyStaff,
        offDuty: offDutyStaff,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Generate automatic and manual bottleneck alerts
const getBottleneckAlerts = async (req, res) => {
  try {
    const [beds, totalStaff, onDutyStaff, manualAlerts] =
      await Promise.all([
        Bed.find(),
        Staff.countDocuments(),
        Staff.countDocuments({ status: "On Duty" }),
        ManualAlert.find().sort({ createdAt: -1 }),
      ]);

    const alerts = [];

    // Check ICU occupancy
    const icuBeds = beds.filter((bed) => bed.type === "ICU");

    const occupiedICUBeds = icuBeds.filter(
      (bed) => bed.status === "Occupied"
    ).length;

    if (
      icuBeds.length > 0 &&
      occupiedICUBeds / icuBeds.length >= 0.8
    ) {
      alerts.push({
        id: "icu-occupancy",
        title: "High ICU Occupancy",
        department: "ICU",
        severity: "Critical",
        description: `${occupiedICUBeds} of ${icuBeds.length} ICU beds are occupied.`,
        time: "Current",
        status: "Active",
        source: "Automatic",
      });
    }

    // Check overall bed occupancy
    const occupiedBeds = beds.filter(
      (bed) => bed.status === "Occupied"
    ).length;

    if (
      beds.length > 0 &&
      occupiedBeds / beds.length >= 0.8
    ) {
      alerts.push({
        id: "bed-occupancy",
        title: "High Bed Occupancy",
        department: "Hospital",
        severity: "High",
        description: `${occupiedBeds} of ${beds.length} hospital beds are occupied.`,
        time: "Current",
        status: "Active",
        source: "Automatic",
      });
    }

    // Check staff duty status
    if (totalStaff > 0 && onDutyStaff === 0) {
      alerts.push({
        id: "staff-availability",
        title: "No Staff Marked On Duty",
        department: "Hospital",
        severity: "High",
        description:
          "Staff records exist, but no staff members are currently marked On Duty.",
        time: "Current",
        status: "Active",
        source: "Automatic",
      });
    }

    // Add manually created alerts
    const formattedManualAlerts = manualAlerts.map((alert) => ({
      id: alert._id.toString(),
      title: alert.title,
      department: alert.department,
      severity: alert.severity,
      description: alert.description,
      time: alert.createdAt
        ? alert.createdAt.toISOString()
        : "Manual",
      status: alert.status,
      source: "Manual",
    }));

    const allAlerts = [...alerts, ...formattedManualAlerts];

    res.status(200).json(allAlerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getBottleneckAlerts,
};
