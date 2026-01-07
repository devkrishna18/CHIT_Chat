import { useContext, useState,useEffect } from "react";
import { createContext } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext=createContext();

export const ChatProvider=({children})=>{
const [messages,setMessages]=useState([]);//msgs for selcted user
const [users,setUsers]=useState([]);//leftside bar me users ki list
const[selectedUser,setSelectedUser]=useState(null);//store id of user to whom we want to chat
const[unseenMessages,setUnseenMessages]=useState({});//store key value i.e. key is user id and value is no. of unseen messages

const{socket,axios}=useContext(AuthContext);
//fuction to get all user for sidebar
const getUsers=async()=>{
    try{
       const{data} =await axios.get("/api/messages/SideUsers");
        if(data.success){
            setUsers(data.filteredUser);
            setUnseenMessages(data.unseenMessages);
        }
    }
    catch(error){
        toast.error(error.message)
    }
}
//function to get messages for selected user
const getMessages=async(userId)=>{
    try{
        const{data}=await axios.get(`/api/messages/allmessages/${userId}`);
        if(data.success){
            setMessages(data.messages);
        }
    }
    catch(error){
 toast.error(error.message)
    }
}
//function to send mgs to selected user
const sendMessage=async(messageData)=>{
    try{
        const{data}=await axios.post(`/api/messages/sendmessage/${selectedUser._id}`,messageData);
        if(data.success){
            setMessages([...messages,data.newMessage]);
        }
        else{
            toast.error(data.message);
        }
    }
    catch(error){
         toast.error(error.message)
    }
}
//function to subscribe to msg for selected user
const subscribeToMessages=async()=>{
    if(!socket) return;
    socket.on("newMessage",(newMessage)=>{
        if(selectedUser && newMessage.senderId===selectedUser._id){
            setMessages([...messages,newMessage]);
            newMessage.seen=true;
            axios.put(`/api/messages/seen/${newMessage.senderId}`);
        }
        else{
            setUnseenMessages((prev)=>({
                ...prev,//prev unseen messages
                [newMessage.senderId]:prev[newMessage.senderId]?prev[newMessage.senderId]+1:1 //if already unseen message from that user is present then increment by 1 else set it to 1
                //[variable ko key bayana]
            }))
            //agr selcted user se chat nhi kr rha hu to notification me add krna h  n0. of unseen message 
        }
    })
}
//function to unsubscribe from msg
const unsubscribeFromMessages=()=>{
    if(socket) socket.off("newMessage");
}
useEffect(()=>{
    subscribeToMessages();
    return()=>unsubscribeFromMessages();
},[socket,selectedUser])
const value={
    messages,
    users,
    selectedUser,
    unseenMessages,
    setMessages,
    getUsers,
    getMessages,
    sendMessage,
    setSelectedUser,
    setUnseenMessages
}
return(
 <ChatContext.Provider value={value}>
        {children}
    </ChatContext.Provider>
)   
}