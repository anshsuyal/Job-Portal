import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    // 1️⃣ No token case
    if (!token) {
      return res.status(401).json({ message: "No token provided. Please login again." });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }

    // 3️⃣ Attach user ID to request object
    req.userId = decoded.userId;

    next(); // proceed to next middleware or route handler
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(403).json({ message: "Authentication failed. Invalid token." });
  }
};

export default isAuth;
