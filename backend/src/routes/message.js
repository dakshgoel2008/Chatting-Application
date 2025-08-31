import express from "express";
import { verifyJWT } from "./../middlewares/verifyJWT.js";
import { deleteMessage, getMessages, getUsers, postReactToMessage, postSendMessage, putStarMessage } from "../controller/message.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.get("/users", verifyJWT, getUsers);
router.get("/:id", verifyJWT, getMessages);
router.post(
    "/send/:id",
    verifyJWT,
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "video", maxCount: 1 },
        { name: "audio", maxCount: 1 },
        { name: "file", maxCount: 1 },
    ]),
    postSendMessage
); // send message to the user.

router.post("/:messageId/react", verifyJWT, postReactToMessage);
router.put("/:messageId/star", verifyJWT, putStarMessage);
router.delete("/:messageId", verifyJWT, deleteMessage);

export default router;
