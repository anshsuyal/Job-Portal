import express from "express";
import { signUp, login, logOut } from "../controllers/auth.controller.js";

const authRouter = express.Router();

// Auth Routes
authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.get("/logout", logOut); // ✅ Changed POST → GET to match frontend

export default authRouter;
