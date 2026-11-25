const express = require("express");
const router = express.Router();

const {
  getHandovers,
  createHandover,
  updateHandover,
  deleteHandover,
} = require("../controllers/staffHandoverController");

router.get("/", getHandovers);
router.post("/", createHandover);
router.put("/:id", updateHandover);
router.delete("/:id", deleteHandover);

module.exports = router;