import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if(!localFilePath){
            return null;
        }
        //upload the file from localPath to cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        console.log("Profile Picture uploaded successfully on cloudinary");
        return response;
    } catch (err) {
        //if the upload fails then we have to delete the video file from localPath
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export { uploadOnCloudinary };