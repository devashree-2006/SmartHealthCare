
const Patient = require("../models/Patient");
const bcrypt = require("bcryptjs");

// REGISTER PATIENT
exports.registerPatient = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      phone,
      age,
      gender,
      address,
      bloodGroup,
    } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        message: "Full name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must contain at least 6 characters",
      });
    }

    const existingPatient = await Patient.findOne({
      email: email.toLowerCase(),
    });

    if (existingPatient) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const patient = await Patient.create({
      fullName,
      email,
      password: hashedPassword,
      phone,
      age,
      gender,
      address,
      bloodGroup,
    });

    req.session.user = {
  id: patient._id,
  role: patient.role,
};

req.session.save((error) => {
  if (error) {
    console.error("Registration session error:", error);
    return res.status(500).json({
      message: "Unable to save registration session",
    });
  }

  res.status(201).json({
    message: "Patient registered successfully",
    patient: {
      id: patient._id,
      fullName: patient.fullName,
      email: patient.email,
      role: patient.role,
    },
  });
});
  } catch (error) {
    console.error("Patient registration error:", error.message);
    res.status(500).json({
      message: "Patient registration failed",
    });
  }
};


// PATIENT LOGIN
exports.loginPatient = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const patient = await Patient.findOne({
      email: email.toLowerCase(),
    });

    if (!patient) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      patient.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    req.session.user = {
      id: patient._id,
      role: patient.role,
    };

    req.session.save((error) => {
      if (error) {
        console.error("Session save error:", error);
        return res.status(500).json({
          message: "Unable to save login session",
        });
      }

      res.json({
        message: "Login successful",
        patient: {
          id: patient._id,
          fullName: patient.fullName,
          email: patient.email,
          role: patient.role,
        },
      });
    });

  } catch (error) {
    console.error("Patient login error:", error.message);
    res.status(500).json({
      message: "Patient login failed",
    });
  }
};

// GET PATIENT PROFILE
exports.getPatientProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(
      req.session.user.id
    ).select("-password");

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json(patient);
  } catch (error) {
    console.error("Get profile error:", error.message);
    res.status(500).json({
      message: "Unable to retrieve patient profile",
    });
  }
};

// UPDATE PATIENT PROFILE
exports.updatePatientProfile = async (req, res) => {
  try {
    const allowedFields = [
      "fullName",
      "phone",
      "age",
      "gender",
      "address",
      "bloodGroup",
      "medicalHistory",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const patient = await Patient.findByIdAndUpdate(
      req.session.user.id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found",
      });
    }

    res.json({
      message: "Profile updated successfully",
      patient,
    });
  } catch (error) {
    console.error("Update profile error:", error.message);
    res.status(500).json({
      message: "Unable to update patient profile",
    });
  }
};
// PATIENT LOGOUT
exports.logoutPatient = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "Logout failed",
      });
    }

    res.clearCookie("caresync.sid");

    res.json({
      message: "Logout successful",
    });
  });
};