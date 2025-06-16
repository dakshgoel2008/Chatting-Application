import express from "express";
import upload from "../utils/multer.js";
import {
    postSignUp,
    postLogin,
    postLogout,
    putUpdateProfile,
    putUpdatePassword,
    postDeleteAccount,
} from "./../controller/auth.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
import User from "../models/user.js";
// import "../utils/passportConfig.js";
// import passport from "passport";
const router = express.Router();

// JWT:
router.post("/signup", upload.single("profileImage"), postSignUp);
router.post("/login", postLogin);
router.post("/logout", postLogout);

// Initiate Google OAuth
// router.get(
//     "/google",
//     passport.authenticate("google", {
//         scope: ["profile", "email"],
//     })
// );

// // Google OAuth callback
// router.get(
//     "/google/callback",
//     passport.authenticate("google", {
//         failureRedirect: `${process.env.CLIENT_URL}/login?error=auth_failed`,
//         session: false, // We're using JWT, not sessions
//     }),
//     googleAuthCallback // Use your controller pattern
// );

// Other routes:
router.put("/update-profile", verifyJWT, upload.single("profileImage"), putUpdateProfile);

router.put("/update-password", verifyJWT, putUpdatePassword);

router.post("/delete-account", verifyJWT, postDeleteAccount);

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
