const bcrypt = require("bcryptjs");
const Doctor = require("../models/Doctor");

const publicDoctor = (doctor) => ({
  id: doctor._id,
  _id: doctor._id,
  name: doctor.name,
  email: doctor.email,
  phone: doctor.phone,
  specialization: doctor.specialization,
  qualification: doctor.qualification,
  experience: doctor.experience,
  hospital: doctor.hospital,
  role: doctor.role,
});

exports.registerDoctor = async (req, res) => {
  try {
    const { name, email, password, phone, specialization, qualification, experience, hospital } = req.body;
    if (!name?.trim() || !email?.trim() || !password || !specialization?.trim()) {
      return res.status(400).json({ message: "Name, email, password and specialization are required." });
    }
    if (password.length < 8) return res.status(400).json({ message: "Password must contain at least 8 characters." });
    if (await Doctor.exists({ email: email.toLowerCase().trim() })) {
      return res.status(409).json({ message: "Email is already registered." });
    }
    const doctor = await Doctor.create({
      name, email, phone, specialization, qualification, experience, hospital,
      password: await bcrypt.hash(password, 10),
    });
    req.session.user = { id: doctor._id.toString(), role: "doctor" };
    req.session.save((error) => {
      if (error) return res.status(500).json({ message: "Unable to save login session." });
      res.status(201).json({ message: "Doctor account created.", doctor: publicDoctor(doctor) });
    });
  } catch (error) {
    res.status(500).json({ message: "Doctor registration failed." });
  }
};

exports.loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Email and password are required." });
    const doctor = await Doctor.findOne({ email: email.toLowerCase().trim() });
    if (!doctor || !(await bcrypt.compare(password, doctor.password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    req.session.user = { id: doctor._id.toString(), role: "doctor" };
    req.session.save((error) => {
      if (error) return res.status(500).json({ message: "Unable to save login session." });
      res.json({ message: "Login successful.", doctor: publicDoctor(doctor) });
    });
  } catch (error) {
    res.status(500).json({ message: "Doctor login failed." });
  }
};

exports.getDoctorProfile = async (req, res) => {
  const doctor = await Doctor.findById(req.session.user.id).select("-password");
  if (!doctor) return res.status(404).json({ message: "Doctor not found." });
  res.json(publicDoctor(doctor));
};

exports.updateDoctorProfile = async (req, res) => {
  const allowed = ["name", "phone", "specialization", "qualification", "experience", "hospital"];
  const updates = Object.fromEntries(allowed.filter((key) => req.body[key] !== undefined).map((key) => [key, req.body[key]]));
  const doctor = await Doctor.findByIdAndUpdate(req.session.user.id, updates, { new: true, runValidators: true }).select("-password");
  if (!doctor) return res.status(404).json({ message: "Doctor not found." });
  res.json({ message: "Profile updated.", doctor: publicDoctor(doctor) });
};

exports.listDoctors = async (_req, res) => {
  const doctors = await Doctor.find().select("name email specialization qualification hospital experience");
  res.json(doctors);
};

exports.publicDoctor = publicDoctor;
