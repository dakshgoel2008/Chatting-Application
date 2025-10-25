import express from "express";
import { verifyJWT } from "./../middlewares/verifyJWT.js";
import { deleteMessage, getMessages, getUsers, postReactToMessage, postSendMessage } from "../controller/message.js";
import upload from "../utils/multer.js";

const router = express.Router();

router.get("/users", verifyJWT, getUsers);

router.post("/react/:messageId", verifyJWT, postReactToMessage);
router.delete("/remove/:messageId", verifyJWT, deleteMessage);

router.get("/:id", verifyJWT, getMessages);

router.post(
    "/send/:id",
    verifyJWT,
    upload.any(), // Accept any file field
    postSendMessage
);

export default router;
