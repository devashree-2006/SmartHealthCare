
const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      select: false,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["Nurse", "Technician", "Receptionist"],
    },

    department: {
      type: String,
      required: true,
      trim: true,
    },

    shift: {
      type: String,
      required: true,
      enum: ["Morning", "Evening", "Night"],
    },

    status: {
      type: String,
      enum: ["On Duty", "Off Duty"],
      default: "Off Duty",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Staff", staffSchema);
