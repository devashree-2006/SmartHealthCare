const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    specialization: { type: String, required: true, trim: true },
    qualification: { type: String, default: "" },
    experience: { type: Number, min: 0, default: 0 },
    hospital: { type: String, default: "CareSync Healthcare" },
    role: { type: String, default: "doctor", immutable: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
