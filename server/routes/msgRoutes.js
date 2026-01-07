const express=require("express");
const router=express.Router();
const{sendMessage,getUserForSideBar,getAllmsgforUser,markMsgSeen}=require("../controllers/msgCont");
const{auth}=require("../middlewares/auth");
router.get("/SideUsers",auth,getUserForSideBar);
router.get("/allmessages/:id",auth,getAllmsgforUser);
router.put("/seen/:id",auth,markMsgSeen);
router.post("/sendmessage/:id",auth,sendMessage);
module.exports=router;