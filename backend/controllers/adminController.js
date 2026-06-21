const db = require("../config/db");

const getDashboardStats = (req, res) => {
  const stats = {};

  db.query(
    "SELECT COUNT(*) AS totalDoctors FROM doctors",
    (err, doctorResult) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      stats.totalDoctors = doctorResult[0].totalDoctors;

      db.query(
        "SELECT COUNT(*) AS totalPatients FROM patients",
        (err, patientResult) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          stats.totalPatients = patientResult[0].totalPatients;

          db.query(
            "SELECT COUNT(*) AS totalAppointments FROM appointments",
            (err, appointmentResult) => {
              if (err) {
                return res.status(500).json({
                  success: false,
                  message: err.message,
                });
              }

              stats.totalAppointments =
                appointmentResult[0].totalAppointments;

              db.query(
                "SELECT COUNT(*) AS totalPrescriptions FROM prescriptions",
                (err, prescriptionResult) => {
                  if (err) {
                    return res.status(500).json({
                      success: false,
                      message: err.message,
                    });
                  }

                  stats.totalPrescriptions =
                    prescriptionResult[0].totalPrescriptions;

                  res.status(200).json({
                    success: true,
                    stats,
                  });
                }
              );
            }
          );
        }
      );
    }
  );
};

module.exports = {
  getDashboardStats,
};