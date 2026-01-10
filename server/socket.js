const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
      cors: {
        origin: ["http://localhost:5173",
            "https://chit-chat-gamma-six.vercel.app", 
            "https://chit-chat-eight-delta.vercel.app" 
        ],
        methods: ["GET", "POST"]
    }
});

const userSocketMap = {}; // {userId: socketId}

// Helper function (Optional: Controller me kaam aayega)
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    
    if (userId != "undefined") userSocketMap[userId] = socket.id;

    // Sabko batao kaun online hai
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

module.exports = { app, io, server, userSocketMap, getReceiverSocketId };
