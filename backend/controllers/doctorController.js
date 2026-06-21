const db = require("../config/db");

// Get All Doctors
const getDoctors = (req, res) => {
  db.query("SELECT * FROM doctors", (err, result) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.status(200).json({
      success: true,
      count: result.length,
      doctors: result,
    });
  });
};

// Get Single Doctor
const getDoctorById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM doctors WHERE doctor_id = ?",
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found",
        });
      }

      res.status(200).json({
        success: true,
        doctor: result[0],
      });
    }
  );
};

// Add Doctor
const addDoctor = (req, res) => {
  const {
    name,
    specialization,
    qualification,
    experience,
    consultation_fee,
    available_days,
    available_slots,
  } = req.body;

  const sql = `
    INSERT INTO doctors
    (name, specialization, qualification, experience, consultation_fee, available_days, available_slots)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      specialization,
      qualification,
      experience,
      consultation_fee,
      available_days,
      available_slots,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(201).json({
        success: true,
        message: "Doctor Added Successfully",
      });
    }
  );
};

// Update Doctor
const updateDoctor = (req, res) => {
  const { id } = req.params;

  const {
    name,
    specialization,
    qualification,
    experience,
    consultation_fee,
    available_days,
    available_slots,
  } = req.body;

  const sql = `
    UPDATE doctors
    SET
      name = ?,
      specialization = ?,
      qualification = ?,
      experience = ?,
      consultation_fee = ?,
      available_days = ?,
      available_slots = ?
    WHERE doctor_id = ?
  `;

  db.query(
    sql,
    [
      name,
      specialization,
      qualification,
      experience,
      consultation_fee,
      available_days,
      available_slots,
      id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.status(200).json({
        success: true,
        message: "Doctor Updated Successfully",
      });
    }
  );
};

// Delete Doctor
const deleteDoctor = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM doctors WHERE doctor_id = ?",
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
        message: "Doctor Deleted Successfully",
      });
    }
  );
};

module.exports = {
  getDoctors,
  getDoctorById,
  addDoctor,
  updateDoctor,
  deleteDoctor,
};