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
        crossOriginEmbedderPolicy: false,
        crossOriginOpenerPolicy: { policy: "same-origin" },
    })
);

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "https://trusted.cdn.com"],
            styleSrc: ["'self'", "https://fonts.googleapis.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    })
);

// CORS Configuration - FIXED VERSION
const devOrigins = process.env.CORS_ORIGINS ? JSON.parse(process.env.CORS_ORIGINS) : ["http://localhost:5173"];
const prodOrigin = process.env.PRODUCTION_CLIENT_URL;

// Build allowed origins array, filtering out any undefined/null values
let allowedOrigins = [];
if (isProduction) {
    if (prodOrigin) {
        // Support multiple production origins if comma-separated
        allowedOrigins = prodOrigin.split(",").map((origin) => origin.trim());
    }
} else {
    allowedOrigins = devOrigins;
}

// Log CORS configuration on startup
console.log("🔒 CORS Configuration:");
console.log("   Environment:", isProduction ? "PRODUCTION" : "DEVELOPMENT");
console.log("   Allowed Origins:", allowedOrigins);

app.use(
    cors({
        origin: function (origin, callback) {
            console.log(`📨 Request from origin: ${origin || "NO ORIGIN HEADER"}`);

            // ✅ ADD: Log the allowed origins for debugging
            console.log(`📋 Allowed origins: ${JSON.stringify(allowedOrigins)}`);

            if (!origin) {
                console.log("✅ Allowing request with no origin header");
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                console.log(`✅ Origin ${origin} is in allowed list`);
                return callback(null, true);
            }

            console.warn(`❌ CORS BLOCKED - Origin not in allowed list: ${origin}`);
            console.warn(`📋 Allowed origins: ${JSON.stringify(allowedOrigins)}`);

            if (!isProduction) {
                console.log("⚠DEV MODE: Allowing anyway for debugging");
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
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

if (!dbPath) {
    console.error("❌ Database connection string not found!");
    console.error("   Please set DB_PATH (dev) or PRODUCTION_DB_PATH (prod) environment variable");
    process.exit(1);
}

mongoose
    .connect(dbPath)
    .then(() => {
        server.listen(PORT, () => {
            console.log("✅ Server Started Successfully!");
            console.log(`   Mode: ${process.env.NODE_ENV || "development"}`);
            console.log(`   URL: http://localhost:${PORT}`);
            console.log(`   Database: ${isProduction ? "Production" : "Development"}`);
            console.log(`   Allowed Origins: ${allowedOrigins.join(", ")}`);
        });
    })
    .catch((err) => {
        console.error("❌ Database connection failed:", err);
        process.exit(1);
    });
