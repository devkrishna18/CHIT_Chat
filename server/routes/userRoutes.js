const express=require("express");
const router=express.Router();
const {signUp,login,isAuthenticated,updateProfile}=require("../controllers/userCont");
const {auth}=require("../middlewares/auth");
router.post("/signup",signUp);
router.post("/login",login);
router.put("/update-profile",auth,updateProfile);
router.get("/check",auth,isAuthenticated);

module.exports=router;