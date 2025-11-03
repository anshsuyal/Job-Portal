import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: "7InLy7uBFRTsFHy6DVdQqKly3cM",
});

export const uploadOnCloudinary = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "posts",
    });
    fs.unlinkSync(filePath);
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return null;
  }
};
