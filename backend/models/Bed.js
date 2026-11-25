
const mongoose = require("mongoose");

const bedSchema = new mongoose.Schema(
  {
    bedNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    ward: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: ["General", "ICU", "Private", "Emergency"],
    },

    status: {
      type: String,
      enum: ["Available", "Occupied"],
      default: "Available",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Bed", bedSchema);
