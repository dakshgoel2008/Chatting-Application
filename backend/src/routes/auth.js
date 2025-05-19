import express from "express";
import upload from "../utils/multer.js";
import { postSignUp, postLogin, postLogout, putUpdateProfile } from "./../controller/auth.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import User from "../models/user.js";
const router = express.Router();

router.post("/signup", upload.single("profileImage"), postSignUp);

router.post("/login", postLogin);

router.post("/logout", postLogout);

router.put("/update-profile", verifyJWT, upload.single("profileImage"), putUpdateProfile);

router.get("/check", verifyJWT, async (req, res, next) => {
    try {
        res.status(200).json(req.user);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/all", async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
