import express from "express";
import { createPost } from "../controllers/post.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/create",  upload.single("image"), createPost);

export default router;
