import mongoose, { Schema } from "mongoose";
const messageSchema = new Schema(
    {
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        receiverId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        // types of files available to be sent
        text: {
            type: String,
            required: false,
            trim: false,
        },
        image: {
            type: String,
            required: false,
        },
        video: {
            type: String,
            required: false,
        },
        audio: {
            type: String,
            required: false,
        },
        file: {
            type: String,
            required: false,
        },

        // for better UI
        isRead: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
        isEdited: {
            type: Boolean,
            default: false,
        },
        isForwarded: {
            type: Boolean,
            default: false,
        },
        isStarred: {
            type: Boolean,
            default: false,
        },
        isPinned: {
            type: Boolean,
            default: false,
        },
        isBlocked: {
            type: Boolean,
            default: false,
        },
        isDeletedBySender: {
            type: Boolean,
            default: false,
        },
        isDeletedByReceiver: {
            type: Boolean,
            default: false,
        },
        isDeletedByBoth: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // Enable timestamps
    }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
