import express from "express";
import upload from "../utils/multer.js";
import { postSignUp, postLogin, postLogout, putUpdateProfile } from "./../controller/auth.js";
import { verifyJWT } from "../middlewares/verifyJWT.js";
const router = express.Router();

router.post("/signup", upload.single("profileImage"), postSignUp);

router.post("/login", postLogin);

router.post("/logout", postLogout);

router.put("/update-profile", verifyJWT, upload.single("profileImage"), putUpdateProfile);

// router.get("/check", (req, res, next) => {
//     console.log("Hello world");
//     res.send("Hello world");
// });

export default router;
