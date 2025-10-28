import express from "express";
import { signUp, login, logOut } from "../controllers/auth.controller.js"; // <-- Added logOut import

const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/login", login);
authRouter.post("/logout", logOut);
export default authRouter;
