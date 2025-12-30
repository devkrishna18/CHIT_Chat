const express=require("express");
const app=express();
const http=require('http')
const {Server}=require("socket.io");
app.use(express.urlencoded({ extended: true })); 
const cors=require("cors");
const cookieParser = require('cookie-parser');

const userRoutes = require('./routes/userRoutes');
const msgRoutes=require("./routes/msgRoutes");
//create express app and http server
const server=http.createServer(app)//“app.listen() hidden server banata hai, but Socket.IO ko same server ka access chahiye — isliye hum khud http.createServer(app) use karte hain.”

const io=new Server(server,{
    cors:{
        origin:"*"
    }
});
const userSocketMap={}; //{userId:socketId}
// diary jisme har userId ke corresponding uska socketId store hoga
io.on("connection",(socket)=>{
    const userId=socket.handshake.query.userId;//as new user coonects we will get his userId
    console.log("User connected ", userId);
    if(userId) userSocketMap[userId]=socket.id;//and store socketId against that userId
    //Emit online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.on("disconnect",()=>{
        console.log("User Disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
})
module.exports = { io, userSocketMap };

//middleware setup
app.use(express.json({limit:'4mb'})); //we can upload image up to 4mb
app.use(cors())

require("dotenv").config();
require('./config/db').connectDB();
const PORT= process.env.PORT || 5000;
app.use("/api/auth",userRoutes);
app.use("/api/messages",msgRoutes);
app.use("/api/status",(req,res)=>res.send("Server is live"))

server.listen(PORT,()=>  console.log(`Server is running on port ${PORT}`))