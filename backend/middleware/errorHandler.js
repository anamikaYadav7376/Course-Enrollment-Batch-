// Centralized error-handling middleware that maps Mongoose errors to clean HTTP status codes
const errorHandler = (err, req, res, next) => {
  console.error("Error occurred:", err.name, err.message);

  let statusCode = err.statusCode || res.statusCode;
  if (!statusCode || statusCode < 400) {
    statusCode = 500;
  }

  let message = err.message || "Internal Server Error";

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || "field";
    const value = err.keyValue ? err.keyValue[field] : "";
    message = `Duplicate value error: A record with ${field} '${value}' already exists.`;
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    const errors = Object.values(err.errors).map((val) => val.message);
    message = errors.join(". ");
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Resource not found with invalid ID: ${err.value}`;
  }

  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please authenticate again.";
  }
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your token has expired. Please log in again.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
  });
};

module.exports = errorHandler;
