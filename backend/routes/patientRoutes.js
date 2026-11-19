
const express = require("express");
const router = express.Router();

const {
  registerPatient,
  loginPatient,
  getPatientProfile,
  updatePatientProfile,
  logoutPatient,
} = require("../controllers/patientController");

const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerPatient);
router.post("/login", loginPatient);

// Protected routes
router.get("/profile", authMiddleware, getPatientProfile);
router.put("/profile", authMiddleware, updatePatientProfile);
router.post("/logout", authMiddleware, logoutPatient);
module.exports = router;