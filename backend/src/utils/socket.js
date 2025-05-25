import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:5173"],
    },
});

export function getReceiverSocketId(userId) {
    return userSocketMap[userId];
}

// for online users.
const userSocketMap = {}; // userid, socketid.

io.on("connection", (socket) => {
    console.log("a user connected", socket.id);

    const userId = socket.handshake.query.userId;
    if (!userId || userId === "undefined") {
        console.warn("Blocked connection: Missing or invalid userId", socket.id);
        socket.disconnect();
        return;
    }

    userSocketMap[userId] = socket.id;
    socket.userId = userId;

    io.emit("getOnlineUsers", Object.keys(userSocketMap)); // sending events to all clients connected.

    socket.on("disconnect", () => {
        console.log("a user disconnected", socket.id);
        if (socket.userId) {
            delete userSocketMap[socket.userId];
        }
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { io, server, app };
