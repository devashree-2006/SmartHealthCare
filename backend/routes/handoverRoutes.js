const express = require("express");
const requireRole = require("../middleware/authMiddleware");
const { listHandovers, createHandover, deleteHandover } = require("../controllers/handoverController");

const router = express.Router();
router.use(requireRole("doctor"));
router.get("/", listHandovers);
router.post("/", createHandover);
router.delete("/:id", deleteHandover);
module.exports = router;
