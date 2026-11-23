const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");

exports.listDoctors = async (_req, res) => {
  const doctors = await Doctor.find().select("name specialization qualification hospital experience");
  res.json(doctors);
};

exports.createAppointment = async (req, res) => {
  const { doctorId, appointmentDate, appointmentTime, type, reason } = req.body;
  if (!mongoose.isValidObjectId(doctorId) || !appointmentDate || !appointmentTime) {
    return res.status(400).json({ message: "Doctor, date and time are required." });
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate) || appointmentDate < new Date().toISOString().slice(0, 10)) {
    return res.status(400).json({ message: "Choose a valid future appointment date." });
  }
  if (!/^\d{2}:\d{2}$/.test(appointmentTime)) {
    return res.status(400).json({ message: "Choose a valid appointment time." });
  }
  const doctor = await Doctor.findById(doctorId).select("name");
  if (!doctor) return res.status(404).json({ message: "Doctor not found." });
  const appointment = await Appointment.create({
    patientId: req.session.user.id,
    doctorId,
    appointmentDate,
    appointmentTime,
    type: type?.trim() || "Consultation",
    reason: reason?.trim() || "",
    status: "Waiting",
  });
  res.status(201).json({ message: "Appointment request sent to your doctor.", appointment: { ...appointment.toObject(), doctorName: doctor.name } });
};

exports.listPatientAppointments = async (req, res) => {
  const appointments = await Appointment.find({ patientId: req.session.user.id })
    .populate("doctorId", "name specialization")
    .sort({ appointmentDate: 1, appointmentTime: 1 });
  res.json(appointments.map((item) => ({
    ...item.toObject(),
    doctorName: item.doctorId?.name || "Doctor",
    specialization: item.doctorId?.specialization || "",
  })));
};

exports.listDoctorAppointments = async (req, res) => {
  const appointments = await Appointment.find({ doctorId: req.session.user.id })
    .populate("patientId", "fullName email phone")
    .sort({ appointmentDate: 1, appointmentTime: 1 });
  res.json(appointments.map((item) => ({
    ...item.toObject(),
    patientName: item.patientId?.fullName || "Patient",
    patientEmail: item.patientId?.email || "",
    patientPhone: item.patientId?.phone || "",
    patientId: item.patientId?._id,
  })));
};

exports.updateDoctorStatus = async (req, res) => {
  const { status } = req.body;
  if (!["Confirmed", "Rejected", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid appointment status." });
  }
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, doctorId: req.session.user.id },
    { status },
    { new: true, runValidators: true }
  );
  if (!appointment) return res.status(404).json({ message: "Appointment not found." });
  res.json({ message: "Appointment status updated.", appointment });
};

exports.updatePatientAppointment = async (req, res) => {
  const { appointmentDate, appointmentTime, status } = req.body;
  const updates = {};
  if (appointmentDate !== undefined) updates.appointmentDate = appointmentDate;
  if (appointmentTime !== undefined) updates.appointmentTime = appointmentTime;
  if (appointmentDate !== undefined && (!/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate) || appointmentDate < new Date().toISOString().slice(0, 10))) {
    return res.status(400).json({ message: "Choose a valid future appointment date." });
  }
  if (appointmentTime !== undefined && !/^\d{2}:\d{2}$/.test(appointmentTime)) {
    return res.status(400).json({ message: "Choose a valid appointment time." });
  }
  if (status === "Cancelled") updates.status = status;
  if (!Object.keys(updates).length) return res.status(400).json({ message: "No valid appointment changes provided." });
  const appointment = await Appointment.findOneAndUpdate(
    { _id: req.params.id, patientId: req.session.user.id, status: { $in: ["Waiting", "Confirmed"] } },
    updates,
    { new: true, runValidators: true }
  );
  if (!appointment) return res.status(404).json({ message: "Active appointment not found." });
  res.json({ message: "Appointment updated.", appointment });
};
