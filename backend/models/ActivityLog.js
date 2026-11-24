
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: ["CREATE", "UPDATE", "DELETE"],
    },

    module: {
      type: String,
      required: true,
      enum: ["Bed Management", "Staff Management"],
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    recordId: {
      type: String,
      default: null,
    },

    performedBy: {
      type: String,
      default: "Administrator",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
