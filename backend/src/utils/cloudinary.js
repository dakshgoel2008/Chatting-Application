import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUDNAME,
    api_key: process.env.CLOUDINARY_APIKEY,
    api_secret: process.env.CLOUDINARY_APISECRET,
});

const uploadOnCloudinary = async (filePath, resourceType = "auto", options = {}) => {
    try {
        if (!filePath) return null;

        // Enhanced upload options for different file types
        const uploadOptions = {
            resource_type: resourceType,
            // For documents, ensure they're accessible
            flags: resourceType === "raw" ? "attachment" : undefined,
            // Preserve original filename for documents
            use_filename: true,
            unique_filename: true,
            ...options,
        };

        const response = await cloudinary.uploader.upload(filePath, uploadOptions);
        console.log("File uploaded successfully", response.url);

        // Clean up local file
        fs.unlinkSync(filePath);
        return response;
    } catch (err) {
        // Clean up local file even on error
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        console.error("Error uploading file to Cloudinary", err);
        return { error: err.message };
    }
};

// Helper function to determine resource type based on MIME type
export const getResourceType = (mimeType) => {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("video/")) return "video";
    if (mimeType.startsWith("audio/")) return "video"; // Cloudinary treats audio as video
    // For documents and other files
    return "raw";
};

// Enhanced upload function that automatically determines resource type
export const smartUploadOnCloudinary = async (filePath, mimeType, options = {}) => {
    const resourceType = getResourceType(mimeType);
    return await uploadOnCloudinary(filePath, resourceType, options);
};

export const uploadDefaultGoogleImageOnCloudinary = async (imageUrl) => {
    try {
        const res = await cloudinary.uploader.upload(imageUrl, {
            resource_type: "image",
            public_id: "default_google_image",
            overwrite: true,
        });
        console.log("Google profile image uploaded:", res.secure_url);
        return res;
    } catch (err) {
        console.error("Error uploading default Google image to Cloudinary", err);
        return null;
    }
};

export default uploadOnCloudinary;
