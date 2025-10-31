import Post from "../models/post.model.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { description } = req.body;
    let newPost;

    if (req.file) {
      // ✅ Upload image to Cloudinary
      const result = await uploadOnCloudinary(req.file.);

      // ✅ Store secure_url instead of full object
      newPost = await Post.create({
        author: req.userId,
        description,
        image: result.secure_url, // Cloudinary image URL
      });
    } else {
      newPost = await Post.create({
        author: req.userId,
        description,
      });
    }

    return res.status(201).json(newPost);
  } catch (error) {
    console.error("❌ Create Post Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
