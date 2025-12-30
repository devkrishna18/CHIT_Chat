const express=require("express");
const router=express.Router();
const{sendMessage,getUserForSideBar,getAllmsgforUser,markMsgSeen}=require("../controllers/msgCont");
const{auth}=require("../middlewares/auth");
router.get("/messages",auth,getUserForSideBar);
router.get("/messges/:id",auth,getAllmsgforUser);
router.put("/seen/:id",auth,markMsgSeen);
router.post("/sendmsg/:id",auth,sendMessage);
module.exports=router;