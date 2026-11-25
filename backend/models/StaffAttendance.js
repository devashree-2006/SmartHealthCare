const mongoose = require("mongoose");

const staffAttendanceSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: true,
    },
    checkIn: {
      type: String,
      default: "",
    },
    checkOut: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["Present"],
      default: "Present",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "StaffAttendance",
  staffAttendanceSchema
);