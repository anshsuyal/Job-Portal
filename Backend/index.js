import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js"; // your DB connection
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";
import userRouter from "./routes/user.routes.js";


dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true, // React app URL
    credentials: true, // allows cookies to be sent
  })
);

// Database connect
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user",userRouter);
app.use("/api/post", postRoutes);

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
