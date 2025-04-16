import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "4kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// STARTS:
import authRoutes from "./routes/auth.js";
import { verifyJWT } from "./middlewares/verifyJWT.js";

app.use("/api/auth", authRoutes);

// connection of DB:
mongoose
    .connect(process.env.DB_PATH)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Connected to DB: http://localhost:` + PORT);
        });
    })
    .catch((err) => {
        console.log("Database connection failed:", err);
    });
