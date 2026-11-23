const express = require("express");
const { registerDoctor, loginDoctor, getDoctorProfile, updateDoctorProfile, listDoctors } = require("../controllers/doctorController");
const requireRole = require("../middleware/authMiddleware");

const router = express.Router();
router.get("/", listDoctors);
router.post("/register", registerDoctor);
router.post("/login", loginDoctor);
router.get("/profile", requireRole("doctor"), getDoctorProfile);
router.put("/profile", requireRole("doctor"), updateDoctorProfile);
module.exports = router;
