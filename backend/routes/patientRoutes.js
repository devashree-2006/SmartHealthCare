
const express = require("express");
const router = express.Router();

const {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile,
  logoutPatient,
} = require("../controllers/patientController");

const requireRole = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerPatient);
router.post("/login", loginPatient);

// Protected routes
router.get("/profile", requireRole("patient"), getPatientProfile);
router.put("/profile", requireRole("patient"), updatePatientProfile);
router.post("/logout", requireRole("patient"), logoutPatient);
module.exports = router;
