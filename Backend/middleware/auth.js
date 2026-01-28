import jwt from "jsonwebtoken";

// Main middleware function
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid or expired token" });
    }

    // Set both id and userId for compatibility
    req.user = {
      id: decoded.userId,
      userId: decoded.userId,
      email: decoded.email
    };
    next();
  });
};

// Export both names for compatibility
export default authMiddleware;
export const authenticateToken = authMiddleware;
