
const mongoose = require("mongoose");

const manualAlertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    department: {
      type: String,
      required: true,
      trim: true,
    },
    severity: {
      type: String,
      enum: ["Critical", "High", "Medium", "Low"],
      required: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Monitoring"],
      default: "Active",
    },
    source: {
      type: String,
      default: "Manual",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ManualAlert", manualAlertSchema);
