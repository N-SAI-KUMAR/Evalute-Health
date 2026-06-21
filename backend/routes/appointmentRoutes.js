const express = require("express");
const router = express.Router();

const {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} = require("../controllers/appointmentController");

const { protect } = require("../middleware/authMiddleware");

// Get All Appointments
router.get("/", protect, getAppointments);

// Get Single Appointment
router.get("/:id", protect, getAppointmentById);

// Book Appointment
router.post("/", protect, bookAppointment);

// Update Appointment
router.put("/:id", protect, updateAppointment);

// Delete Appointment
router.delete("/:id", protect, deleteAppointment);

module.exports = router;