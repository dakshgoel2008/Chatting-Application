import User from "../models/user.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import ErrorWrapper from "../utils/ErrorWrapper.js";
import Message from "./../models/message.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

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
            imageUrl = await uploadOnCloudinary(req.files.image[0].path); // Upload image
        }
        if (req.files?.video) {
            videoUrl = await uploadOnCloudinary(req.files.video[0].path); // Upload video
        }
        if (req.files?.audio) {
            audioUrl = await uploadOnCloudinary(req.files.audio[0].path); // Upload audio
        }
        if (req.files?.file) {
            fileUrl = await uploadOnCloudinary(req.files.file[0].path); // Upload general file
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

        // TODO: Real time functionality to send the message to the receiver.

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
