const { cloudinary } = require("../config/cloudinary");
const Message = require("../models/message");
const User = require("../models/User");
const{io,userSocketMap}=require("../index.js")
//get all user except logged in user
exports.getUserForSideBar=async(req,res)=>{
    try{
        const userId=req.user._id;
        //finding all user except the logged in
        const filteredUser=await User.find({_id:{$ne:userId}}).select("-password");
        const unseenMessages={};
//count no. of unseen msgs where receiver is logged in user
        const promise=filteredUser.map(async(user)=>{
            const messages=await Message.find({
                senderId:user._id,
                receiverId:userId,
                seen:false
            })
            if(messages.length>0){
                unseenMessages[user._id]=messages.length;
            }
        })
// Start: map chala, 10 DB queries fire huin.
// Wait: await Promise.all(promise) ne code ko wahin ROK diya (Pause).
// Process: Background mein unseenMessages object fill ho raha hai.
// Finish: Jab sab queries complete ho gayin, tabhi code agli line (return res.status...) par gaya.

        await Promise.all(promise);
        return res.status(200).json({
            success:true,
            filteredUser,
            unseenMessages
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}

//Get all msgs for a selected user
exports.getAllmsgforUser=async(req,res)=>{
    try{
        const myId=req.user._id;    
        const{id:selectedUserId}=req.params;
        const messages=await Message.find({
            $or:[
                {senderId:myId,receiverId:selectedUserId},
                {senderId:selectedUserId,receiverId:myId}
            ]
        })
        await Message.updateMany({senderId:selectedUserId, receiverId:myId},{seen:true});
        return res.status(200).json({
            success:true,
            messages
        })
    }
    catch(error){
            return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}
//api to mark messgages as seen using messageid;
exports.markMsgSeen=async(req,res)=>{
    try{
        const{id}=req.params;
        await Message.findByIdAndUpdate(id,{seen:true});
        return res.status(200).json({
            success:true,
            message:"Message marked as seen"
        })
    }
    catch(error){
         return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}
//sending message api
exports.sendMessage=async(req,res)=>{
    try{
        const{text,image}=req.body;
        const senderId=req.user._id;
        const{receiverId}=req.body;
        let imageUrl;
        if(image){
            const imgupload=await cloudinary.uploader.upload(image);
            imageUrl=imgupload.secure_url;
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })
        await newMessage.save();
const receiverSocketId=userSocketMap[receiverId];//searching in the userSocket app ki ye receiver online h ki nahi
if(receiverSocketId){
    io.to(receiverSocketId).emit("newMessage",newMessage)//only is reciever ko message bhj do
}

        return res.status(200).json({
            success:true,
            newMessage,
            message:"Message sent successfully"
        })
    }
    catch(error){
         return res.status(500).json({
                success:false,
                message:error.message
            })
    }
}