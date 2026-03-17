import React from 'react'
import logo from '../assets/logo.png'
import { FaRegHeart } from 'react-icons/fa'
import { useSelector } from 'react-redux'

import Story from './Story'
import Post from './Post'
import Navbar from './Navbar'
const Feed = () => {
  const userData = useSelector((state) => state.user.user)
  return (
    <div className=" w-full md:w-[50%] h-screen  flex flex-col relative overflow-hidden ">
      <div className="flex justify-between items-center w-full p-8 md:p-">
        <div className="w-16 h-16 overflow-hidden">
          <img src={logo} alt="" className="w-full h-full object-contain" />
        </div>
        <FaRegHeart size={24} className="text-white" />
      </div>
      <div className="mx-4 h-[120px] overflow-x-auto overflow-y-hidden flex gap-4 px-4 ">
        <Story />
        <Story />
        <Story />
        <Story />
      </div>
      <Post />
      <div className="absolute bottom-8 md:w-[96%] w-full mx-auto ">
        <Navbar />
      </div>
    </div>
  )
}

export default Feed
