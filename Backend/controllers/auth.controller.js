import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, userName, email, password } = req.body;

    // Check for existing email
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Check for existing username
    const existUsername = await User.findOne({ userName });
    if (existUsername) {
      return res.status(400).json({ message: "Username already exists!" });
    }

    // Password validation
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
    });

    // Generate token
    const token = await genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict", // ✅ Corrected from 'samSite'
      secure: process.env.NODE_ENV === "production", // ✅ Corrected variable name
    });

    // Remove password from response
    const { password: _, ...userData } = user._doc;

    return res.status(201).json({ message: "Signup successful!", user: userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Signup error!" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user existence
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist!" });
    }

    // Validate password
    if (!password || password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // Generate token
    const token = await genToken(user._id);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // Remove password from response
    const { password: _, ...userData } = user._doc;

    return res.status(200).json({ message: "Login successful!", user: userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Login error!" });
  }
};

export const logOut = async (req,res)=>{
  try {
    res.clearCookie("token")
    return res.status(200).json({message:"logout successfully"})
  } catch (error) {
    console.log(error);
    return res.status(500).json({message:"logout error"})
    
  }
}