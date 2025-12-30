import React from 'react'
import { createContext } from 'react' 
import  toast from 'react-hot-toast'
import axios from 'axios' 
import {io} from 'socket.io-clinet'     
import { useState } from 'react';
import { useEffect } from 'react';
require("dotenv").config();
const backendUrl=process.env.VITE_BACKEND_URL;
axios.defaults.baseURL=backendUrl;

export const AuthContext=createContext();
export const AuthProvider=({children})=>{
    const [token,setToken]=useState(localStorage.getItem("token"));
    const[authUser,setAuthUser]=useState(null);
    const[onlineUsers,setOnlineUsers]=useState([]);
    const[socket,setSocket]=useState(null);

    //check if user is authenticated
    const checkAuth=async()=>{
        try{
            const{data}=await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                connectSocket(data.user);
            }
        }
        catch(error){
            toast.error(error.message);
        }
    }
    //connect socket function to handle socket connection and online users updates
const connectSocket=(userData)=>{
    if(!userData||socket?.connected) return;
    const newSocket=io(backendUrl,{
        query:{
            userId:userData._id,
        }
    });
    newSocket.connect();
    setSocket(newSocket);
    newSocket.on("getOnlineUsers",(users)=>{
        setOnlineUsers(users);
    });
}
//page ek first time relod hone pr hi i have to check ki user is authenticated or not
useEffect(()=>{
    if(token){
        axios.defaults.headers.common["token"]=token;
    }
    checkAuth();
},[])

    const value={
        axios,
        authUser,
        onlineUsers,
        socket
    }


    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}