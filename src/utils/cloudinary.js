import {v2 as cloudinary} from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
//configuring cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (localFilePath)=>{
    try{
        if (!localFilePath) return null;
        const response = await cloudinary.uploader.upload(
            localFilePath,{
                resource_type: "auto"
            }
        )
        console.log("cloudinary response",response);
        //once the file uploded the we would like to delete the local file
        fs.unlinkSync(localFilePath);
        return response;
    }catch(error){
        fs.unlinkSync(localFilePath);
        return null;
    }
}

export {uploadOnCloudinary};