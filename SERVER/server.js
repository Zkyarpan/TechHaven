const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
require("dotenv").config();
const path = require("path");
const fs = require("fs");

// Import routes
const authRoutes = require("./routes/auth");
const laptopRoutes = require("./routes/laptops");
const orderRoutes = require("./routes/orders");
const categoryRoutes = require("./routes/categories");
const reviewRoutes = require("./routes/reviews");
const cartRoutes = require("./routes/cart");
const userRoutes = require("./routes/auth");

// Initialize Express app
const app = express();

// Import database connection
const connectDB = require("./config/db");

// Connect to MongoDB
connectDB();

// Security: Add Helmet middleware for security headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable CSP for development
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin resource sharing
  })
);

// Rate limiting for auth routes to prevent brute force
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

// CORS configuration
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Your React app's origin
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Important for cookies/authentication
  exposedHeaders: ["Content-Disposition"], // Add if needed for downloads
};

app.use(cors(corsOptions));

// Serve static files
app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader(
      "Access-Control-Allow-Origin",
      process.env.CLIENT_URL || "http://localhost:5173"
    );
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    next();
  },
  express.static(path.join(__dirname, "public", "uploads"))
);

app.use(express.static(path.join(__dirname, "public")));

// Middleware
app.use(express.json({ limit: "10mb" })); // Increase payload limit for image uploads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// File upload middleware
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  })
);

// Request logger middleware - use morgan in development
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());

// Load Passport configurations
require("./config/passport");

// JWT token parser middleware
app.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7, authHeader.length);
    req.token = token;
    if (process.env.NODE_ENV !== "production") {
      console.log(`[Server] JWT token present in request`);
    }
  }

  next();
});

// Create upload directories if they don't exist
const createUploadDirs = () => {
  const dirs = [
    path.join(__dirname, "public", "uploads", "laptops"),
    path.join(__dirname, "public", "uploads", "categories"),
    path.join(__dirname, "public", "uploads", "reviews"),
    path.join(__dirname, "public", "uploads", "users"),
  ];

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    }
  });
};

createUploadDirs();

// API Routes with versioning
app.use("/api/auth", authLimiter, authRoutes); // Apply rate limiting to auth routes
app.use("/api/laptops", laptopRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to TechHaven API",
    version: "1.0.0",
    documentation: "Access /api-docs for API documentation",
    routes: {
      auth: "/api/auth - Authentication endpoints",
      laptops: "/api/laptops - Laptop management endpoints",
      orders: "/api/orders - Order management endpoints",
      categories: "/api/categories - Category management endpoints",
      reviews: "/api/reviews - Review management endpoints",
      cart: "/api/cart - Shopping cart endpoints",
      users: "/api/users - User management endpoints",
      health: "/health - API health check",
    },
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "TechHaven API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    path: req.originalUrl,
  });
});

// Error handling middleware with more detailed response
app.use((err, req, res, next) => {
  console.error(`[Server] Error: ${err.message}`);

  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Determine status code (default to 500)
  const statusCode = err.statusCode || 500;

  // Prepare error response
  const errorResponse = {
    message: err.message || "Something went wrong!",
    status: statusCode,
    error:
      process.env.NODE_ENV === "production" ? "An error occurred" : err.message,
  };

  // Only include stack trace in development
  if (process.env.NODE_ENV !== "production") {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
});

// Graceful shutdown handling
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    server.close(() => {
      console.log("Process terminated");
      process.exit(0);
    });
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully");
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed");
    server.close(() => {
      console.log("Process terminated");
      process.exit(0);
    });
  });
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Promise Rejection:", err);
  // Don't crash the server, just log the error
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`API available at: http://localhost:${PORT}`);
});

// Export for testing purposes
module.exports = { app, server };
