import path from "path";
import express from "express";
import { postSignUp, postLogin } from "./../controller/auth.js";
const router = express.Router();

router.post("/signup", postSignUp);

router.post("/login", postLogin);

// router.get("/check", (req, res, next) => {
//     console.log("Hello world");
//     res.send("Hello world");
// });

export default router;
