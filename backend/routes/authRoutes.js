const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  changePassword,
  forgotPassword,
  verifyOTP,
} = require("../controllers/authController");

const {
  validateRegister,
} = require("../middleware/validationMiddleware");

const { protect } = require("../middleware/authMiddleware");

router.post(
  "/register",
  validateRegister,
  registerUser
);

router.post("/login", loginUser);

// Profile
router.get("/profile", protect, getProfile);

// Change Password
router.put(
  "/change-password",
  protect,
  changePassword
);

// Forgot Password
router.post(
  "/forgot-password",
  forgotPassword
);

// Verify OTP & Reset Password
router.post(
  "/verify-otp",
  verifyOTP
);

module.exports = router;