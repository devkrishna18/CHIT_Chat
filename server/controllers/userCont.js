const cloudinary = require("../config/cloudinary");
const { generateToken } = require("../lib/utils");
const User = require("../models/User");
const bcrypt = require("bcrypt");
//signup
exports.signUp = async (req, res) => {

    try{
         const{fullName,email,password,bio}=req.body;
        if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });}
let haspwd;
    try {
      haspwd = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).json({ message: "Error in password hashing" });
    }
    const user = await User.create({
      fullName,
      email,
      password: haspwd,
      bio
    });
    const payload = {
    id: user._id,
    fullName: user.fullName,
    email: user.email
};

const token = generateToken(payload);

   return res.status(200).json({
    success:true,
    userData:user,
    token,
    message:"Account created successfully"
   })
    }
    catch(error){
        console.log(error.message)
        return res.status(500).json({
            success:false,
            message:error.message,  
        })
    }      
}
            // login
exports.login=async(req,res)=>{
    try{
        const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }
    const userReg = await User.findOne({ email });
    if (!userReg) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }
    const isMatch = await bcrypt.compare(password, userReg.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
     const payload = {
    id: userReg._id,
    fullName: userReg.fullName,
    email: userReg.email
};

const token = generateToken(payload);
    return res.status(200).json({
    success:true,
    userData:userReg,
    token,
    message:"Logined successfully"
   })

    }
    catch (err) {
    return res.status(500).json({
      success: false,
      message: "Error in user login",
    });
}
}
// Check if user is authenticated
exports.isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true, 
      user: req.user,
      message: "User is authenticated" });
  } catch (error) {
    return res.json({ success: false });
  }
}
//CONTROLLER TO UPDATE USER PROFILE DETAILS
exports.updateProfile=async(req,res)=>{
  try{
    const{profilePic,bio,fullName}=req.body;
    const userId=req.user.id;
    let updatedUser;
    if(!profilePic){
      updatedUser=await User.findByIdAndUpdate(userId,{bio,fullName},{new:true});
    }
    else{
      const upload=await cloudinary.uploader.upload(profilePic);
       updatedUser=await User.findByIdAndUpdate(userId,{profilePic:upload.secure_url,bio,fullName},{new:true});
    }
    return res.status(200).json({
    success:true,
    user: updatedUser,
    message:"Profile updated successfully"
    })
  }
  catch(error){
    console.log("Error in updateProfile:", error);
     return res.status(500).json({
      success: false,
      message: "Error in updatingProfile",
    });
  }
}