import multer from "multer";
import path from "path";

//FUN, MIME:Multipurpose Internet Mail Extensions
const validFileTypes = {
    image: ["image/jpeg", "image/png", "image/gif", "image/jpg"], // allowed image formats
    video: ["video/mp4", "video/webm", "video/ogg"], // allowed video formats
    audio: ["audio/mpeg", "audio/wav", "audio/ogg"], // allowed audio formats
    file: ["application/pdf", "application/msword", "application/vnd.ms-excel"], // allowed file formats
};
// Setting up disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Generating unique filenames
    },
});

// File filter to allow specific MIME types
const fileFilter = (req, file, cb) => {
    console.log(`Uploading file with MIME type: ${file.mimetype}`);
    let allowedTypes = [];

    if (file.fieldname === "image") {
        allowedTypes = validFileTypes.image;
    } else if (file.fieldname === "video") {
        allowedTypes = validFileTypes.video;
    } else if (file.fieldname === "audio") {
        allowedTypes = validFileTypes.audio;
    } else if (file.fieldname === "file") {
        allowedTypes = validFileTypes.file;
    }

    if (allowedTypes.includes(file.mimetype)) {
        return cb(null, true); // Accept the file
    } else {
        return cb(new Error("Invalid file type"), false); // Reject the file
    }
};

// Initialize multer with storage and fileFilter
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limited file size: 50MB
});

export default upload;
