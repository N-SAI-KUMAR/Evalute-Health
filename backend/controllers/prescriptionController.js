const db = require("../config/db");

// Get All Prescriptions
const getPrescriptions = (req, res) => {
  db.query("SELECT * FROM prescriptions", (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      count: results.length,
      prescriptions: results,
    });
  });
};

// Get Single Prescription
const getPrescriptionById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM prescriptions WHERE prescription_id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        prescription: result[0],
      });
    }
  );
};

// Add Prescription
const addPrescription = (req, res) => {
  const { appointment_id, medicines, notes } = req.body;

  db.query(
    "INSERT INTO prescriptions (appointment_id, medicines, notes) VALUES (?, ?, ?)",
    [appointment_id, medicines, notes],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Prescription Added Successfully",
      });
    }
  );
};

// Update Prescription
const updatePrescription = (req, res) => {
  const { id } = req.params;
  const { appointment_id, medicines, notes } = req.body;

  db.query(
    "UPDATE prescriptions SET appointment_id=?, medicines=?, notes=? WHERE prescription_id=?",
    [appointment_id, medicines, notes, id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Prescription Updated Successfully",
      });
    }
  );
};

// Delete Prescription
const deletePrescription = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM prescriptions WHERE prescription_id=?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Prescription Deleted Successfully",
      });
    }
  );
};

module.exports = {
  getPrescriptions,
  getPrescriptionById,
  addPrescription,
  updatePrescription,
  deletePrescription,
};