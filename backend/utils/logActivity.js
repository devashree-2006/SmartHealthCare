
const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({
  action,
  module,
  description,
  recordId = null,
  performedBy = "Administrator",
}) => {
  try {
    await ActivityLog.create({
      action,
      module,
      description,
      recordId,
      performedBy,
    });
  } catch (error) {
    console.error("Activity log could not be saved:", error.message);
  }
};

module.exports = logActivity;
