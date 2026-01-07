import React, {useState, useRef ,useEffect, useContext} from 'react'
import assets, { messagesDummyData } from '../assets/assets'
import { formatDate } from '../lib/utils';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const ChatContainer = () => {
  const {messages,selectedUser,setSelectedUser,sendMessage,
    getMessages}=useContext(ChatContext);
   const {authUser,onlineUsers}=useContext(AuthContext);
  const scrollEnd=useRef();

  const [input, setInput] = useState('');

  //handel function to send text msg
const handelSendMessage=async (e)=>{
  e.preventDefault();
  if(input.trim()==='') return null;
  await sendMessage({
    text:input.trim()
  })
  setInput("");
}
//handel function to send image
const handelSendImage=async(e)=>{
const file=e.target.files[0];
if(!file||!file.type.startsWith("image/")){
  toast.error("Please select a valid image file");
  return;
}
const reader=new FileReader();
reader.onloadend=async()=>{
  await sendMessage({image:reader.result})
  e.target.value="";
}
reader.readAsDataURL(file);
}
useEffect(()=>{
  if(selectedUser){
    getMessages(selectedUser._id);
  }
},[selectedUser])
  useEffect(()=>{
    if(scrollEnd.current && messages.length>0){
      scrollEnd.current.scrollIntoView({behavior:'smooth'})
    }
  },[messages])
  // useEffect(()=>{
  //   if(onlineUsers.length>0 && selectedUser){
      
  //   }
  // },[onlineUsers]);
  return selectedUser?(
    <div className='h-full overflow-scroll relative backdrop-blur-bg'>
      {/* {chat header} */}
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
      <img src={selectedUser.profilePic ||assets.avatar_icon} className='rounded-full  w-8' alt="" />
      <p className='flex-1 text-lg text-white flex items-center gap-2'>{selectedUser.fullName}
        {onlineUsers.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
      </p>
      <img onClick={()=>setSelectedUser(null)} src={assets.arrow_icon} className='md:hidden max-w-7' alt="" />
      <img src={assets.help_icon} className='max-md:hidden max-w-5' alt="" />
      </div>

      {/* chat conversation */}
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
          {messages.map((msg,index)=>(
            <div key={index} className={`flex items-end gap-2 justify-end
            ${msg.senderId!==authUser._id && 'flex-row-reverse'}`}>
              {msg.image?(
                <img src={msg.image}className='max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8' alt="" />
              ):(
                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all
                   bg-violet-500/30 text-white
                   ${msg.senderId===authUser._id?'rounded-br-none':'rounded-bl-none'}`}>{msg.text}</p>
              ) }
              <div className='text-center text-xs'>
                <img src={msg.senderId===authUser._id?authUser ?.profilePic || assets.avatar_icon:selectedUser?.profilePic||assets.avatar_icon
                } alt="" 
                className='w-7 rounded-full'/>
                <p className='text-gray-500'>{formatDate(msg.createdAt) }</p>
              </div>
            </div>
          ))}
          <div ref={scrollEnd}></div>
      </div>

        {/* bottom area   */}
        <div className='absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3'>
          <div className='flex-1 flex items-center  rounded-full px-3 bg-gray-100/12 '>
            <input onChange={(e)=>setInput(e.target.value)}
            onKeyDown={(e)=>e.key==='Enter'?handelSendMessage(e):null} type="text" className='flex-1 text-sm p-3 border-none rounded-lg outline-none text-white placeholder-gray-200 text-white/50' placeholder='Send a message' />
            <input onChange={handelSendImage} type="file" id='image' accept='image/png,image/jpeg' hidden/>
            <label htmlFor="image">
              <img className='w-5 mr-2 cursor-pointer' src={assets.gallery_icon} alt="" />
            </label>
          </div>
          <img onClick={handelSendMessage} src={assets.send_button} className='w-7 cursor-pointer' alt="" />
        </div>



    </div>
  ):(
    <div className=' flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <img src={assets.logo_icon} className='max-w-16 ' alt="" />
      <p className='text-lg font-mideum text-white'>Chat anytime,anywhere</p>
    </div>
  )
}

export default ChatContainer