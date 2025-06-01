const jwt = require("jsonwebtoken");

const User = require("../models/User");
// Middleware to authenticate JWT and attach user data
const authMiddleware = async (req, res, next) => {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Unauthorized: No token provided",
        code: "NO_TOKEN",
      });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      console.error("JWT verification error:", error.message);
      return res.status(401).json({
        error: "Unauthorized: Invalid or expired token",
        code: "INVALID_TOKEN",
      });
    }

    // Fetch user from database
    const user = await User.findById(decoded.userId).select("_id role");
    if (!user) {
      return res.status(404).json({
        error: "User not found",
        code: "USER_NOT_FOUND",
      });
    }

    // Attach user data to request
    req.userId = user._id;
    req.userRole = user.role || "user"; // Default to 'user' if role is not set

    // Optional: Role-based access control
    // Example: Restrict admin routes
    if (req.path.startsWith("/api/admin") && req.userRole !== "admin") {
      return res.status(403).json({
        error: "Forbidden: Admin access required",
        code: "FORBIDDEN",
      });
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    res.status(500).json({
      error: "Internal server error",
      code: "SERVER_ERROR",
    });
  }
};

// Middleware to check for admin role
const adminMiddleware = (req, res, next) => {
  if (req.userRole !== "admin") {
    return res.status(403).json({
      error: "Forbidden: Admin access required",
      code: "FORBIDDEN",
    });
  }
  next();
};

module.exports = { authMiddleware, adminMiddleware };
