import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    let { token } = req.cookies;
    if (!token) {
      return res.status(400).json({ Message: "user doesn't have token" });
    }
    let verifyToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifyToken) {
      return res.status(400).json({ Message: "User doesn't have valid token" });
    }

    req.userId = verifyToken.userId;
    next();
  } catch (error) {
    return res.status(500).json({ Message: "Is Auth Error" });
  }
};

export default isAuth;
