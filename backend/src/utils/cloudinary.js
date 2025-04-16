import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
});

const uploadOnCloudinary = async (filePath) => {
    try {
        if (!filePath) return null;
        const response = await cloudinary.uploader.upload(filePath);
        console.log("File uploaded successfully", response.url);
        fs.unlinkSync(filePath);
        return response;
    } catch (err) {
        fs.unlinkSync(filePath); // to delete the file
        console.error("Error uploading file to Cloudinary", err);
        return err;
    }
};

export default uploadOnCloudinary;
