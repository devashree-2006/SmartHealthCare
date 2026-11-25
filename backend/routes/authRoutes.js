const express = require("express");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const Staff = require("../models/Staff");
const bcrypt = require("bcryptjs");

const router = express.Router();
router.get("/me", async (req, res) => {
  const sessionUser = req.session?.user;
  if (!sessionUser) return res.status(401).json({ message: "Not logged in." });
  if (sessionUser.role === "admin") {
    return res.json({ id: sessionUser.id, email: sessionUser.email, role: "admin" });
  }
  const Model = sessionUser.role === "doctor" ? Doctor : sessionUser.role === "patient" ? Patient : sessionUser.role === "staff" ? Staff : null;
  if (!Model) return res.status(401).json({ message: "Invalid session." });
  const user = await Model.findById(sessionUser.id).select("-password");
  if (!user) return res.status(401).json({ message: "Account not found." });
  res.json({ ...user.toObject(), id: user._id, role: sessionUser.role });
});
router.post("/staff-login", async (req, res) => {
  try {
    const { staffId, password } = req.body || {};
    if (!staffId || !password) return res.status(400).json({ message: "Staff ID and password are required." });
    const staff = await Staff.findOne({ staffId: staffId.trim() }).select("+passwordHash");
    if (!staff?.passwordHash || !(await bcrypt.compare(password, staff.passwordHash))) {
      return res.status(401).json({ message: "Invalid staff ID or password." });
    }
    req.session.regenerate((error) => {
      if (error) return res.status(500).json({ message: "Unable to start staff session." });
      req.session.user = { id: staff._id.toString(), role: "staff" };
      req.session.save((saveError) => {
        if (saveError) return res.status(500).json({ message: "Unable to save staff session." });
        res.json({ id: staff._id, staffId: staff.staffId, name: staff.name, role: "staff" });
      });
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/admin-login", async (req, res) => {
  const { email, password } = req.body || {};
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminEmail || !passwordHash) {
    return res.status(503).json({ message: "Admin sign-in is not configured." });
  }
  if (!email || !password || email.trim().toLowerCase() !== adminEmail ||
      !(await bcrypt.compare(password, passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password." });
  }
  req.session.regenerate((error) => {
    if (error) return res.status(500).json({ message: "Unable to start admin session." });
    req.session.user = { id: "configured-admin", email: adminEmail, role: "admin" };
    req.session.save((saveError) => {
      if (saveError) return res.status(500).json({ message: "Unable to save admin session." });
      res.json({ id: "configured-admin", email: adminEmail, role: "admin" });
    });
  });
});
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ message: "Logout failed." });
    res.clearCookie("caresync.sid");
    res.json({ message: "Logout successful." });
  });
});
module.exports = router;
