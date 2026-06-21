const express = require("express");
const router = express.Router();

const {
  getPrescriptions,
  getPrescriptionById,
  addPrescription,
  updatePrescription,
  deletePrescription,
} = require("../controllers/prescriptionController");

const { protect } = require("../middleware/authMiddleware");

// Get All Prescriptions
router.get("/", protect, getPrescriptions);

// Get Single Prescription
router.get("/:id", protect, getPrescriptionById);

// Add Prescription
router.post("/", protect, addPrescription);

// Update Prescription
router.put("/:id", protect, updatePrescription);

// Delete Prescription
router.delete("/:id", protect, deletePrescription);

module.exports = router;