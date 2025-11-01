import express from "express";
import { createPost, getPost } from "../controllers/post.controller.js";
import upload from "../middlewares/multer.js";
import isAuth from "../middlewares/isAuth.js";

const postRouter = express.Router();

postRouter.post("/create", isAuth ,upload.single("image"), createPost);
postRouter.post("/getpost",isAuth,getPost)

export default postRouter;
