const db = require("../config/db");

// Create Appointment
const bookAppointment = (req, res) => {
  const {
    patient_id,
    doctor_id,
    appointment_date,
    appointment_time,
    status,
  } = req.body;

  const sql = `
    INSERT INTO appointments
    (patient_id, doctor_id, appointment_date, appointment_time, status)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      status,
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
        message: "Appointment Booked Successfully",
      });
    }
  );
};

// Get All Appointments
const getAppointments = (req, res) => {
  db.query("SELECT * FROM appointments", (err, results) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    }

    res.json({
      success: true,
      count: results.length,
      appointments: results,
    });
  });
};

// Get Single Appointment
const getAppointmentById = (req, res) => {
  const { id } = req.params;

  db.query(
    "SELECT * FROM appointments WHERE appointment_id = ?",
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
        appointment: result[0],
      });
    }
  );
};

// Update Appointment
const updateAppointment = (req, res) => {
  const { id } = req.params;

  const {
    patient_id,
    doctor_id,
    appointment_date,
    appointment_time,
    status,
  } = req.body;

  const sql = `
    UPDATE appointments
    SET patient_id=?,
        doctor_id=?,
        appointment_date=?,
        appointment_time=?,
        status=?
    WHERE appointment_id=?
  `;

  db.query(
    sql,
    [
      patient_id,
      doctor_id,
      appointment_date,
      appointment_time,
      status,
      id,
    ],
    (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        message: "Appointment Updated Successfully",
      });
    }
  );
};

// Delete Appointment
const deleteAppointment = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM appointments WHERE appointment_id = ?",
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
        message: "Appointment Deleted Successfully",
      });
    }
  );
};

module.exports = {
  bookAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};