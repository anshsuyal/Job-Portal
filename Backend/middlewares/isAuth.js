import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(401).json({ message: "No token provided. Please login again." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    req.userId = decoded.id || decoded._id || decoded.userId;
    if (!req.userId) {
      return res.status(401).json({ message: "User ID missing in token" });
    }

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(403).json({ message: "Authentication failed. Invalid token." });
  }
};

export default isAuth;
