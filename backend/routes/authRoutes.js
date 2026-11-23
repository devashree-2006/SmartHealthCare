const express = require("express");
const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");

const router = express.Router();
router.get("/me", async (req, res) => {
  const sessionUser = req.session?.user;
  if (!sessionUser) return res.status(401).json({ message: "Not logged in." });
  const Model = sessionUser.role === "doctor" ? Doctor : sessionUser.role === "patient" ? Patient : null;
  if (!Model) return res.status(401).json({ message: "Invalid session." });
  const user = await Model.findById(sessionUser.id).select("-password");
  if (!user) return res.status(401).json({ message: "Account not found." });
  res.json({ ...user.toObject(), id: user._id, role: sessionUser.role });
});
router.post("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.status(500).json({ message: "Logout failed." });
    res.clearCookie("caresync.sid");
    res.json({ message: "Logout successful." });
  });
});
module.exports = router;
