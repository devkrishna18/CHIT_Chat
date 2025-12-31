const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { connectDB } = require('./config/db');

// IMPORT from socket.js (Ye sabse important line hai)
const { app, server } = require("./socket.js");

const userRoutes = require('./routes/userRoutes');
const msgRoutes = require("./routes/msgRoutes");

dotenv.config();

const PORT = process.env.PORT || 5000;

// 1. Middlewares (Routes se pehle aane chahiye)
app.use(express.json({ limit: '10mb' })); // Image upload ke liye size badhaya
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS Setup (Frontend 5173 ke liye allow karein)
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // Cookies bhejne ke liye zaruri hai
}));

// 2. Database Connect
connectDB();

// 3. Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", msgRoutes);

// Health Check Route
app.use("/api/status", (req, res) => res.send("Server is live and Socket is ready"));

// 4. Server Listen (Server use karein, app nahi)
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});