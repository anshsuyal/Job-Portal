import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uploadONCLoudinary = async (filePath) => {
      // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME , 
        api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
        api_secret: "7InLy7uBFRTsFHy6DVdQqKly3cM" // Click 'View API Keys' above to copy your API secret
    });

    try {
        if(!filePath){
            return null
        }
        const uploadResult = await cloudinary.uploader.upload(filePath)
        fs.unlinkSync(filePath)
        return  uploadResult.secure_url
    } catch (error) {
        fs.unlinkSync(filePath)
        console.log(error);
        
    }
}
export default uploadONCLoudinary