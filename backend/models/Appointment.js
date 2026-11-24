const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    appointmentDate: { type: String, required: true },
    appointmentTime: { type: String, required: true },
    type: { type: String, default: "Consultation", trim: true },
    reason: { type: String, default: "", trim: true },
    status: { type: String, enum: ["Waiting", "Confirmed", "Rejected", "Completed", "Cancelled"], default: "Waiting" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
