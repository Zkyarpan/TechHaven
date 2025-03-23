// middleware/errorHandler.js

/**
 * Custom error handler middleware
 * Provides consistent error responses and logs detailed error information
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Server Error] ${err.message}`);

  // Include stack trace in development
  if (process.env.NODE_ENV !== "production") {
    console.error(err.stack);
  }

  // Handle MongoDB connection errors specifically
  if (err.name === "MongoNetworkError" || err.message.includes("ETIMEDOUT")) {
    return res.status(503).json({
      success: false,
      error: "Database connection error",
      message:
        "The server is currently unable to handle the request due to database connectivity issues. Please try again later.",
      statusCode: 503,
    });
  }

  // Handle MongoDB validation errors
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      error: "Validation Error",
      message: messages.join(", "),
      statusCode: 400,
    });
  }

  // Handle Mongoose casting errors (e.g., invalid ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      error: "Invalid Data",
      message: `Invalid ${err.path}: ${err.value}`,
      statusCode: 400,
    });
  }

  // Handle duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      error: "Duplicate Entry",
      message: `The ${field} already exists. Please use a different value.`,
      statusCode: 409,
    });
  }

  // Default error response
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.name || "Server Error",
    message: err.message || "An unexpected error occurred on the server",
    statusCode: statusCode,
    // Include additional details in development
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = errorHandler;
