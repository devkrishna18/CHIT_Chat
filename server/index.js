const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');

// IMPORT from socket.js
const { app, server } = require("./socket.js");

const userRoutes = require('./routes/userRoutes');
const msgRoutes = require("./routes/msgRoutes");

dotenv.config();

// 1. Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Setup
app.use(cors({
    origin: [
        "http://localhost:5173",                     
        "https://chit-chat-eight-delta.vercel.app",  
        "https://chit-chat-gamma-six.vercel.app",    
        process.env.CLIENT_URL                       
    ],
    credentials: true
}));

// 2. Database Connect
connectDB();

// 3. Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", msgRoutes);

// Health Check Route
app.use("/api/status", (req, res) => res.send("Server is live and Socket is ready"));


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
