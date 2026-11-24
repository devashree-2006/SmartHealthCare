const mongoose = require("mongoose");
const Handover = require("../models/Handover");

exports.listHandovers = async (req, res) => {
  const records = await Handover.find({ doctorId: req.session.user.id }).sort({ createdAt: -1 });
  res.json(records);
};

exports.createHandover = async (req, res) => {
  const { patientName, patientId, condition, treatment, followUp, notes } = req.body;
  if (!patientName?.trim() || !condition?.trim()) {
    return res.status(400).json({ message: "Patient name and condition are required." });
  }
  if (patientId && !mongoose.isValidObjectId(patientId)) {
    return res.status(400).json({ message: "Invalid patient ID." });
  }
  const handover = await Handover.create({
    doctorId: req.session.user.id,
    patientId: patientId || null,
    patientName: patientName.trim(),
    condition: condition.trim(),
    treatment: treatment || "",
    followUp: followUp || "",
    notes: notes || "",
  });
  res.status(201).json({ handover });
};

exports.deleteHandover = async (req, res) => {
  const handover = await Handover.findOneAndDelete({ _id: req.params.id, doctorId: req.session.user.id });
  if (!handover) return res.status(404).json({ message: "Handover not found." });
  res.json({ message: "Handover deleted." });
};
