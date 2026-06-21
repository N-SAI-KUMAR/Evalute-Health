const db = require("../config/db");

// Get All Patients
const getPatients = (req, res) => {
  db.query("SELECT * FROM patients", (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.status(200).json({
      success: true,
      count: result.length,
      patients: result,
    });
  });
};

// Get Single Patient
const getPatientById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM patients WHERE patient_id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        patient: result[0],
      });
    }
  );
};

// Add Patient
const addPatient = (req, res) => {
  const { name, age, gender, phone, email, address } = req.body;

  db.query(
    "INSERT INTO patients(name, age, gender, phone, email, address) VALUES(?,?,?,?,?,?)",
    [name, age, gender, phone, email, address],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Patient Added Successfully",
      });
    }
  );
};

// Update Patient
const updatePatient = (req, res) => {
  const { id } = req.params;
  const { name, age, gender, phone, email, address } = req.body;

  db.query(
    `UPDATE patients
     SET name=?, age=?, gender=?, phone=?, email=?, address=?
     WHERE patient_id=?`,
    [name, age, gender, phone, email, address, id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Patient Updated Successfully",
      });
    }
  );
};

// Delete Patient
const deletePatient = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM patients WHERE patient_id=?",
    [id],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Patient Deleted Successfully",
      });
    }
  );
};

module.exports = {
  getPatients,
  getPatientById,
  addPatient,
  updatePatient,
  deletePatient,
};