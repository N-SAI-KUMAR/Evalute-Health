const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100000,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use(limiter);

// Database Connection
require("./config/db");

// Error Middleware
const errorHandler = require("./middleware/errorMiddleware");

// Routes
const doctorRoutes = require("./routes/doctorRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const authRoutes = require("./routes/authRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const adminRoutes = require("./routes/adminRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// API Routes
app.use("/api/doctors", doctorRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

// Static Upload Folder
app.use("/uploads", express.static("uploads"));

// Swagger Documentation
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

// Home Route
app.get("/", (req, res) => {
  res.send("Appointment Management API Running...");
});

// Centralized Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});