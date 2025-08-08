import multer from "multer";
import path from "path";

//FUN, MIME:Multipurpose Internet Mail Extensions
const validFileTypes = {
    image: ["image/jpeg", "image/png", "image/gif", "image/jpg", "image/webp"],
    video: ["video/mp4", "video/webm", "video/ogg", "video/avi", "video/mov"],
    audio: ["audio/mpeg", "audio/wav", "audio/ogg", "audio/webm", "audio/mp3", "audio/mp4", "audio/x-m4a"],
    file: [
        "application/pdf",
        "application/msword",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ],
};

// Setting up disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/uploads");
    },

    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    },
});

// File filter to allow specific MIME types
const fileFilter = (req, file, cb) => {
    console.log(`Field name: ${file.fieldname}`);
    console.log(`MIME type: ${file.mimetype}`);
    console.log(`Original name: ${file.originalname}`);

    const allAllowedTypes = [
        ...validFileTypes.image,
        ...validFileTypes.video,
        ...validFileTypes.audio,
        ...validFileTypes.file,
    ];

    console.log(`All allowed types:`, allAllowedTypes);
    console.log(`Audio types specifically:`, validFileTypes.audio);
    console.log(`Is audio/webm included?`, allAllowedTypes.includes("audio/webm"));
    console.log(`Does current file match?`, allAllowedTypes.includes(file.mimetype));

    if (allAllowedTypes.includes(file.mimetype)) {
        console.log(`File accepted: ${file.mimetype}`);
        return cb(null, true);
    } else {
        console.log(`File rejected: ${file.mimetype}`);
        return cb(new Error(`Invalid file type: ${file.mimetype}`), false);
    }
};

// Initialize multer with storage and fileFilter
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // Limited file size: 50MB
});

export default upload;
