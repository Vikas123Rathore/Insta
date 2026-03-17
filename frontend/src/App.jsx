import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import GetCurrentUser from './Hooks/GetCurrentUser'
import SuggestedUser from './Hooks/SuggestedUser'
import GetUserProfile from './pages/GetUserProfile'
import EditProfile from './pages/EditProfile'
const App = () => {
  let serverUrl = 'http://localhost:5000'
  GetCurrentUser()
  SuggestedUser()
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/getuserprofile/:username" element={<GetUserProfile />} />
        <Route path="/edit" element={<EditProfile />} />
      </Routes>
    </>
  )
}

export default App
