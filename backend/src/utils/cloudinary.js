import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
});

const uploadOnCloudinary = async (filePath, resourceType = "auto") => {
    try {
        if (!filePath) return null;
        const response = await cloudinary.uploader.upload(filePath, { resource_type: resourceType });
        console.log("File uploaded successfully", response.url);
        fs.unlinkSync(filePath);
        return response;
    } catch (err) {
        fs.unlinkSync(filePath); // to delete the file
        console.error("Error uploading file to Cloudinary", err);
        return err;
    }
};

export const uploadDefaultGoogleImageOnCloudinary = async (imageUrl) => {
    try {
        const res = await cloudinary.uploader.upload(imageUrl, {
            resource_type: "image",
            public_id: "default_google_image",
            overwrite: true,
        });
        console.log("Google profile image uploaded:", response.secure_url);
        return res;
    } catch (err) {
        console.error("Error uploading default Google image to Cloudinary", err);
        return null;
    }
};

export default uploadOnCloudinary;
