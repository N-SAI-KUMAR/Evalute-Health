const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
      "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)";

    db.query(
      sql,
      [name, email, hashedPassword, role || "patient"],
      (err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: err.message,
          });
        }

        res.status(201).json({
          success: true,
          message: "User Registered Successfully",
        });
      }
    );
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
const loginUser = (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User Not Found",
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(
        password,
        user.password
      );

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid Credentials",
        });
      }

      const token = jwt.sign(
        {
          id: user.user_id,
          role: user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).json({
        success: true,
        token,
      });
    }
  );
};

// Get Profile
const getProfile = (req, res) => {
  db.query(
    "SELECT user_id, name, email, role FROM users WHERE user_id = ?",
    [req.user.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      res.json({
        success: true,
        user: result[0],
      });
    }
  );
};

// Change Password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  db.query(
    "SELECT * FROM users WHERE user_id = ?",
    [req.user.id],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      const user = result[0];

      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Current password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      db.query(
        "UPDATE users SET password=? WHERE user_id=?",
        [hashedPassword, req.user.id],
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          res.json({
            success: true,
            message: "Password Changed Successfully",
          });
        }
      );
    }
  );
};

// Forgot Password
const forgotPassword = (req, res) => {
  const { email } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User Not Found",
        });
      }

      const otp = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const otpExpiry = Date.now() + 10 * 60 * 1000;

      db.query(
        "UPDATE users SET otp=?, otp_expiry=? WHERE email=?",
        [otp, otpExpiry, email],
        async (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          await sendEmail(
            email,
            "Password Reset OTP",
            `Your OTP is ${otp}`
          );

          res.json({
            success: true,
            message: "OTP sent to email",
          });
        }
      );
    }
  );
};

// Verify OTP
const verifyOTP = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  db.query(
    "SELECT * FROM users WHERE email=?",
    [email],
    async (err, result) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      const user = result[0];

      if (
        !user ||
        user.otp !== otp ||
        Date.now() > user.otp_expiry
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid or Expired OTP",
        });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      db.query(
        "UPDATE users SET password=?, otp=NULL, otp_expiry=NULL WHERE email=?",
        [hashedPassword, email],
        (err) => {
          if (err) {
            return res.status(500).json({
              success: false,
              message: err.message,
            });
          }

          res.json({
            success: true,
            message: "Password Reset Successful",
          });
        }
      );
    }
  );
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  changePassword,
  forgotPassword,
  verifyOTP,
};