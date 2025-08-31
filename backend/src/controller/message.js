import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import Message from "./../models/message.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "./../utils/socket.js";

export const getUsers = ErrorWrapper(async (req, res, next) => {
    try {
        const meAndOnlyMe = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: meAndOnlyMe } }).select(
            "-password -refreshToken -__v -createdAt -updatedAt"
        );
        res.status(201).json({
            message: "Users fetched successfully",
            users: filteredUser,
            success: true,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new ErrorHandler(500, "Can't fetch the users (Internal Server Error)", [error.message]);
    }
});

export const getMessages = ErrorWrapper(async (req, res, next) => {
    try {
        const { id: receiverId } = req.params; // id of the user whom we want to chat with.
        // after that just renaming it.
        if (!receiverId) {
            throw new ErrorHandler(400, "User id is required");
        }
        const myId = req.user._id; // id of the logged in user.
        const messages = await Message.find({
            // just a filter to get the messages between two users.
            $or: [
                { senderId: myId, receiverId: receiverId },
                { senderId: receiverId, receiverId: myId },
            ],
        });
        res.status(201).json({
            message: "Messages fetched successfully",
            message: messages, // array of the messages that we wanna see as history.
            success: true,
        });
    } catch (error) {
        console.error("Error fetching user:", error);
        throw new ErrorHandler(500, "Can't fetch the user (Internal Server Error)", [error.message]);
    }
});

export const postSendMessage = ErrorWrapper(async (req, res, next) => {
    try {
        const startTime = Date.now();
        const { id: receiverId } = req.params; // id of the user whom we want to chat with.
        // after that just renaming it.
        if (!receiverId) {
            throw new ErrorHandler(400, "User id is required");
        }
        const senderId = req.user._id; // id of the logged in user.

        // checking for the files to send.
        const { text } = req.body;
        // Initialize file URLs to null (in case no files are uploaded)
        let imageUrl = null;
        let videoUrl = null;
        let audioUrl = null;
        let fileUrl = null;

        if (req.files?.image) {
            const s = Date.now();
            imageUrl = await uploadOnCloudinary(req.files.image[0].path); // Upload image
            const e = Date.now() - s;
            console.log(`[METRICS] Image upload time: ${e}ms`);
        }
        if (req.files?.video) {
            const s = Date.now();
            videoUrl = await uploadOnCloudinary(req.files.video[0].path); // Upload video
            const e = Date.now() - s;
            console.log(`[METRICS] Video upload time: ${e}ms`);
        }
        if (req.files?.audio) {
            const s = Date.now();
            audioUrl = await uploadOnCloudinary(req.files.audio[0].path); // Upload audio
            const e = Date.now() - s;
            console.log(`[METRICS] Audio upload time: ${e}ms`);
        }
        if (req.files?.file) {
            const s = Date.now();
            fileUrl = await uploadOnCloudinary(req.files.file[0].path); // Upload general file
            const e = Date.now() - s;
            console.log(`[METRICS] File upload time: ${e}ms`);
        }
        const message = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl ? imageUrl.url : null,
            video: videoUrl ? videoUrl.url : null,
            audio: audioUrl ? audioUrl.url : null,
            file: fileUrl ? fileUrl.url : null,
        });

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
        }

        const responseTime = Date.now() - startTime;
        console.log(`[METRICS] Send Message - Response Time: ${responseTime}ms`);

        res.status(201).json({
            message: "Message sent successfully",
            message, // array of the messages that we wanna see as history.
            success: true,
        });
    } catch (error) {
        console.error("Error sending message:", error);
        throw new ErrorHandler(500, "Can't send the message (Internal Server Error)", [error.message]);
    }
});
export const postReactToMessage = ErrorWrapper(async (req, res) => {
    const { messageId } = req.params;
    const { emoji } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message) throw new ErrorHandler(404, "Message not found");

    const existingReaction = message.reactions.find((r) => r.userId.toString() === userId.toString());

    if (existingReaction) {
        if (existingReaction.emoji === emoji) {
            // Remove reaction if the same emoji is clicked again
            message.reactions = message.reactions.filter((r) => r.userId.toString() !== userId.toString());
        } else {
            // Update reaction if a different emoji is clicked
            existingReaction.emoji = emoji;
        }
    } else {
        // Add new reaction
        message.reactions.push({ emoji, userId });
    }

    await message.save();

    io.to(message.senderId.toString()).emit("messageReaction", message);
    io.to(message.receiverId.toString()).emit("messageReaction", message);

    res.status(200).json(message);
});

export const putStarMessage = ErrorWrapper(async (req, res) => {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) throw new ErrorHandler(404, "Message not found");

    message.isStarred = !message.isStarred;
    await message.save();

    res.status(200).json(message);
});

export const deleteMessage = ErrorWrapper(async (req, res) => {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) throw new ErrorHandler(404, "Message not found");

    await message.deleteOne();
    res.status(200).json({ message: "Message deleted" });
});
