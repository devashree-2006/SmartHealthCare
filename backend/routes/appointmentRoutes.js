const express = require("express");
const requireRole = require("../middleware/authMiddleware");
const {
  listDoctors,
  createAppointment,
  listPatientAppointments,
  listDoctorAppointments,
  updateDoctorStatus,
  updatePatientAppointment,
} = require("../controllers/appointmentController");

const router = express.Router();
router.get("/doctors", listDoctors);
router.get("/mine", requireRole("patient"), listPatientAppointments);
router.post("/", requireRole("patient"), createAppointment);
router.patch("/:id", requireRole("patient"), updatePatientAppointment);
router.get("/doctor", requireRole("doctor"), listDoctorAppointments);
router.patch("/:id/status", requireRole("doctor"), updateDoctorStatus);
module.exports = router;
