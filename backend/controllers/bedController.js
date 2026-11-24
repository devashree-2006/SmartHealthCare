
const Bed = require("../models/Bed");
const logActivity = require("../utils/logActivity");

// @desc Get all beds
const getBeds = async (req, res) => {
  try {
    const beds = await Bed.find().sort({ createdAt: -1 });
    res.status(200).json(beds);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add a new bed
const addBed = async (req, res) => {
  try {
    const { bedNumber, ward, type, status } = req.body;

    if (!bedNumber || !ward || !type) {
      return res.status(400).json({
        message: "Bed number, ward and type are required",
      });
    }

    const existingBed = await Bed.findOne({ bedNumber });

    if (existingBed) {
      return res.status(409).json({
        message: "Bed number already exists",
      });
    }

    const bed = await Bed.create({
      bedNumber,
      ward,
      type,
      status,
    });

    await logActivity({
      action: "CREATE",
      module: "Bed Management",
      description: `Added bed ${bed.bedNumber}`,
      recordId: bed._id.toString(),
    });

    res.status(201).json(bed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Update a bed
const updateBed = async (req, res) => {
  try {
    const bed = await Bed.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!bed) {
      return res.status(404).json({ message: "Bed not found" });
    }

    await logActivity({
      action: "UPDATE",
      module: "Bed Management",
      description: `Updated bed ${bed.bedNumber}`,
      recordId: bed._id.toString(),
    });

    res.status(200).json(bed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete a bed
const deleteBed = async (req, res) => {
  try {
    const bed = await Bed.findByIdAndDelete(req.params.id);

    if (!bed) {
      return res.status(404).json({ message: "Bed not found" });
    }

    await logActivity({
      action: "DELETE",
      module: "Bed Management",
      description: `Deleted bed ${bed.bedNumber}`,
      recordId: bed._id.toString(),
    });

    res.status(200).json({
      message: "Bed deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBeds,
  addBed,
  updateBed,
  deleteBed,
};
