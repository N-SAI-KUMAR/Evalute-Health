const express = require("express");
const router = express.Router();

const {
  getPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient,
} = require("../controllers/patientController");

router.get("/", getPatients);

router.get("/:id", getPatientById);

router.post("/", addPatient);

router.put("/:id", updatePatient);

router.delete("/:id", deletePatient);

module.exports = router;