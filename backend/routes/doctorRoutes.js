const express = require("express");
const router = express.Router();

const {
  getDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctorController");

// Get All Doctors
router.get("/", getDoctors);

// Get Single Doctor
router.get("/:id", getDoctorById);

// Add Doctor
router.post("/", addDoctor);

// Update Doctor
router.put("/:id", updateDoctor);

// Delete Doctor
router.delete("/:id", deleteDoctor);

module.exports = router;