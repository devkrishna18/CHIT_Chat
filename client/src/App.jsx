import React from 'react'
import  { Toaster } from 'react-hot-toast'
import bgImage from './assets/bgImage.svg';
import { Route, Routes } from 'react-router-dom'
import  HomePage from './pages/HomePage.jsx'
import  LoginPage from './pages/LoginPage.jsx'
import  ProfilePage from './pages/ProfilePage.jsx'
const App = () => {
  return (
    <div   className="min-h-screen bg-cover bg-no-repeat bg-center" 
      style={{ backgroundImage: `url(${bgImage})` }}>
     <Toaster/>
      <Routes>
        <Route path='/' element={<HomePage/>}/>
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/profile' element={<ProfilePage/>}/>
      </Routes>
    </div>
  )
}

export default App