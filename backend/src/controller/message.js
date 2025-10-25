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
        const { id: receiverId } = req.params;
        if (!receiverId) {
            throw new ErrorHandler(400, "User id is required");
        }
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: receiverId },
                { senderId: receiverId, receiverId: myId },
            ],
        });
        res.status(201).json({
            message: "Messages fetched successfully",
            message: messages,
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
        const { id: receiverId } = req.params;

        if (!receiverId) {
            throw new ErrorHandler(400, "User id is required");
        }

        const senderId = req.user._id;
        const { text } = req.body;

        console.log("\n=== Processing Message ===");
        console.log("Receiver ID:", receiverId);
        console.log("Sender ID:", senderId);
        console.log("Text:", text);
        console.log("Files received:", req.files);

        // Initialize file URLs
        let imageUrl = null;
        let videoUrl = null;
        let audioUrl = null;
        let fileUrl = null;

        // ✅ FIXED: Process files based on MIME type, not field name
        if (req.files && req.files.length > 0) {
            for (const file of req.files) {
                const mimetype = file.mimetype.toLowerCase();
                console.log(`Processing file: ${file.originalname}, MIME: ${mimetype}`);

                try {
                    // Detect file type by MIME
                    if (mimetype.startsWith("image/")) {
                        console.log("Uploading as IMAGE");
                        const s = Date.now();
                        const result = await uploadOnCloudinary(file.buffer, {
                            resource_type: "image",
                            folder: "chat-images",
                        });
                        imageUrl = result.secure_url;
                        console.log(`Image uploaded: ${imageUrl} (${Date.now() - s}ms)`);
                    } else if (mimetype.startsWith("video/")) {
                        console.log("Uploading as VIDEO");
                        const s = Date.now();
                        const result = await uploadOnCloudinary(file.buffer, {
                            resource_type: "video",
                            folder: "chat-videos",
                        });
                        videoUrl = result.secure_url;
                        console.log(`Video uploaded: ${videoUrl} (${Date.now() - s}ms)`);
                    } else if (mimetype.startsWith("audio/")) {
                        console.log("Uploading as AUDIO");
                        const s = Date.now();
                        const result = await uploadOnCloudinary(file.buffer, {
                            resource_type: "video", // Cloudinary treats audio as video
                            folder: "chat-audio",
                        });
                        audioUrl = result.secure_url;
                        console.log(`Audio uploaded: ${audioUrl} (${Date.now() - s}ms)`);
                    } else {
                        console.log("Uploading as FILE/DOCUMENT");
                        const s = Date.now();
                        const result = await uploadOnCloudinary(file.buffer, {
                            resource_type: "raw",
                            folder: "chat-files",
                        });
                        fileUrl = result.secure_url;
                        console.log(`File uploaded: ${fileUrl} (${Date.now() - s}ms)`);
                    }
                } catch (uploadError) {
                    console.error(`Error uploading ${file.originalname}:`, uploadError);
                    throw new ErrorHandler(500, `Failed to upload ${file.originalname}`);
                }
            }
        }

        // Create message
        const message = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl,
            video: videoUrl,
            audio: audioUrl,
            file: fileUrl,
        });

        console.log("Message created:", message._id);

        // Send via Socket.IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", message);
            console.log("Message sent via socket to:", receiverId);
        }

        const responseTime = Date.now() - startTime;
        console.log(`[METRICS] Send Message - Total Response Time: ${responseTime}ms`);

        res.status(201).json({
            message: "Message sent successfully",
            message: message,
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

export const deleteMessage = ErrorWrapper(async (req, res) => {
    const { messageId } = req.params;
    const message = await Message.findById(messageId);
    if (!message) throw new ErrorHandler(404, "Message not found");

    await message.deleteOne();
    res.status(200).json({ message: "Message deleted" });
});
