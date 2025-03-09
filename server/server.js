// server/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const path = require("path");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const adminRoutes = require("./routes/admin");
const assessmentRoutes = require("./routes/assessment");
const contactRoutes = require("./routes/contact");
const vulnerabilityRoutes = require("./routes/vulnerability"); // Added vulnerability route
const scanRoute = require("./routes/scanRoute");

const app = express();

// Security middleware
app.use(helmet());
app.use(cookieParser());

// CORS configuration (allow credentials)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);
app.options("*", cors());

// Parse JSON and URL-encoded payloads
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Global rate limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(globalLimiter);

// Updated CSRF protection

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  },
});
//uncomment this
app.use(csrfProtection);

// CSRF token endpoint

app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Use routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/vulnerabilities", vulnerabilityRoutes); // Integrated vulnerability API
app.use("/api/scan", scanRoute);

// Serve static files from uploads folder
app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"), {
    setHeaders: (res) => {
      res.set("Content-Security-Policy", "default-src 'none';");
    },
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
