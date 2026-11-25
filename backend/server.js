const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });
console.log("MongoDB URI loaded:", !!process.env.MONGO_URI);
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const handoverRoutes = require("./routes/handoverRoutes");
const authRoutes = require("./routes/authRoutes");
const staffRoutes = require("./routes/staffRoutes");
const staffTaskRoutes = require("./routes/staffTaskRoutes");
const staffTransferRoutes = require("./routes/staffTransferRoutes");
const staffHandoverRoutes = require("./routes/staffHandoverRoutes");
const staffAttendanceRoutes = require("./routes/staffAttendanceRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Session configuration
app.use(
  session({
    name: "caresync.sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      dbName: "caresync",
      collectionName: "sessions",
      ttl: 24 * 60 * 60,
    }),
    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

// Patient API Routes
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/handovers", handoverRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/staff", staffRoutes);
app.use("/api/staff-tasks", staffTaskRoutes);
app.use("/api/staff-transfers", staffTransferRoutes);
app.use("/api/staff-handovers", staffHandoverRoutes);
app.use("/api/staff-attendance", staffAttendanceRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CareSync Backend is running!",
  });
});

// Server startup
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI || !process.env.SESSION_SECRET) {
      throw new Error("Missing MONGO_URI or SESSION_SECRET in .env");
    }

    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`CareSync server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
