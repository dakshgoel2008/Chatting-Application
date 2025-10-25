import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import cors from "cors";
// Routes
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import { app, server } from "./utils/socket.js";

// const app = express();       // socket.js {removing duplicacy}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4444;

const isProduction = process.env.NODE_ENV === "production";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginEmbedderPolicy: false, // Changed for Express 4 compatibility
        crossOriginOpenerPolicy: { policy: "same-origin" },
    })
);

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://trusted.cdn.com"], // for adding CDNs
            styleSrc: ["'self'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"], // Added https: for external images
        },
    })
);

// CORS:
const devOrigins = process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : ["http://localhost:5173"];
const prodOrigin = process.env.PRODUCTION_CLIENT_URL; // Add this to your production env variables
const allowedOrigins = isProduction ? [prodOrigin] : devOrigins;

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests with no origin (like mobile apps, Postman, server-to-server)
            if (!origin) {
                return callback(null, true);
            }

            // Check if origin is in allowed list
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                console.warn(`CORS blocked for origin: ${origin}`);
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

if (isProduction) {
    const clientBuildPath = path.join(__dirname, "..", "..", "client", "dist");
    app.use(express.static(clientBuildPath));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(clientBuildPath, "index.html"));
    });
}

// DB Connection:
const dbPath = isProduction ? process.env.PRODUCTION_DB_PATH : process.env.DB_PATH;
mongoose
    .connect(dbPath)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on http://localhost:${PORT}`);
            console.log(`Connected to DB: ${isProduction ? "Production DB" : "Development DB"}`);
            console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
        });
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
        process.exit(1); // Exit if DB connection fails
    });
