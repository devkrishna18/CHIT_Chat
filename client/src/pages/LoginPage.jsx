import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext';

const LoginPage = () => {
  const [currState , setCurrState]=useState('Sign Up');
  const [fullName , setfullName]=useState('');
  const [email , setemail]=useState('');
  const [password , setpass]=useState('');
   const [bio , setbio]=useState('');
   const[isDataSubmitted,setisDataSubmitted]=useState(false);
   const {login}=useContext(AuthContext);
  const onSubmitHandler=(e)=>{
    e.preventDefault(e);
    if(currState==='Sign Up' && !isDataSubmitted ){
      setisDataSubmitted(true)
      return;
    }
    login(currState==='Sign Up'?'signup':'login',{fullName,email,password,bio});
  }
  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8
    sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* left */}
      <img src={assets.logo_big} className='w-[min(30vw,250px)]' alt="" />
    {/* right */}
      <form onSubmit={onSubmitHandler} action="" className='border-2 bg-white/8 text-white border-gray-500 p-6
      flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>{currState}
          {isDataSubmitted &&  <img onClick={()=> setisDataSubmitted(false)} src={assets.arrow_icon} className='w-5 cursor-pointer' alt="" />} 
        </h2>

        {currState==='Sign Up'&& !isDataSubmitted &&( <input 
         onChange={(e)=> setfullName(e.target.value)} value={fullName}  type="text" className='border border-gray-500 rounded-md focus:outline-none p-2'
        placeholder='Full Name' required />)}
       
       {!isDataSubmitted &&(   <input
       onChange={(e)=> setemail(e.target.value)} value={email} type="email" className='border border-gray-500 rounded-md focus:outline-none p-2'
        placeholder='Email Address' required />
)}
       {!isDataSubmitted &&( <input 
        onChange={(e)=> setpass(e.target.value)} value={password}  type="password" className='border border-gray-500 rounded-md focus:outline-none p-2'
        placeholder='Password' required />
)}

{isDataSubmitted && currState==='Sign Up' &&(
  <textarea onChange={(e)=>setbio(e.target.value)} value={bio} rows={4}  className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2
  focus:ring-indigo-500 ' placeholder='provide a short bio...' required></textarea>
)}
         
    <button type='submit' className='cursor-pointer bg-gradient-to-r from-purple-400 to-violet-600 py-3 rounded-lg'>
      {currState==='Sign Up'?"Create Account" : "Login Now"}</button>

      <div className='flex items-center gap-2 text-sm'>
        <input className='cursor-pointer' type="checkbox" />
        <p className='text-gray-500 font-medium'>Agree to the terms of use & privacy policy.</p>
      </div>

      <div className='flex flex-col gap-2'>
        {currState==='Sign Up'?(<p className='text-gray-500 text-sm'>Already have an account? <span onClick={()=>{setCurrState("Login"); setisDataSubmitted(false)}} className='text-violet-500  font-medium cursor-pointer'>Login here</span></p>):
        (  <p className='text-gray-500 text-sm'>Create an account? <span onClick={()=>setCurrState('Sign Up')} className='text-violet-500  font-medium cursor-pointer' >Sign-up</span></p>)}
      
      </div>
      </form>
    </div>
  )
}

export default LoginPage