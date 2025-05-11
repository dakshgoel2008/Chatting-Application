import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
// Routes
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 4444;

app.use(express.json({ limit: "4kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
    helmet({
        crossOriginResourcePolicy: { policy: "cross-origin" },
        crossOriginEmbedderPolicy: { policy: "credentialless" },
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
            imgSrc: ["'self'", "data:"],
        },
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// DB Connection:
mongoose
    .connect(process.env.DB_PATH)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Connected to DB: http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.log("Database connection failed:", err);
    });
