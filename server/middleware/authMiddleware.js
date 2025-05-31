import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token, auth denied" });
  }

  try {
    console.log("JWT_SECRET in middleware:", process.env.JWT_SECRET); // Debug
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // ✅ Set req.user for use in controllers
    req.user = { id: decoded.userId };

    next();
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ message: "Token is not valid" });
  }
};

export default authMiddleware;
