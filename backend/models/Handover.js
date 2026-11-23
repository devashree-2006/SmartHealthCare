const mongoose = require("mongoose");

const handoverSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", default: null },
    patientName: { type: String, required: true, trim: true },
    condition: { type: String, required: true, trim: true },
    treatment: { type: String, default: "" },
    followUp: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Handover", handoverSchema);
