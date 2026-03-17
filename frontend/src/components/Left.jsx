import React from 'react'
import logo from '../assets/logo.png'
import { FaRegHeart } from 'react-icons/fa'
import { MdPerson } from 'react-icons/md'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { setUser } from '../redux/userSlice'

const Left = () => {
  const serverUrl = 'http://localhost:5000'

  const navigate = useNavigate()
  const userData = useSelector((state) => state.user.user)
  console.log('userData in Left component:', userData)
  const suggestedUsers = useSelector((state) => state.user.suggestedUsers)
  const dispatch = useDispatch()
  console.log('suggestedUsers:', suggestedUsers)

  const handlelogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      })
      dispatch(setUser(null))
      navigate('/login')
    } catch (error) {
      console.log('error in logout', error)
    }
  }
  return (
    <div className="w-[25%] h-screen border-r-2 border-gray-200 hidden md:flex flex-col ">
      <div className="flex justify-between items-center w-full p-4">
        <div className="w-16 h-16 overflow-hidden">
          <img src={logo} alt="" className="w-full h-full object-contain" />
        </div>
        <FaRegHeart size={24} className="text-white" />
      </div>

      <div className="flex justify-between items-center px-4 py-2 border-b border-gray-500 mx-4 ">
        <div
          className="flex gap-2 cursor-pointer"
          onClick={() => navigate(`/getuserprofile/${userData?.username}`)}
        >
          <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
            {userData ? (
              <img
                src={userData.profileImage}
                alt="profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <MdPerson size={40} className="text-white" />
            )}
          </div>
          <div className="flex flex-col items-start justify-center">
            <h1 className="text-lg font-bold text-white">
              {userData?.username || 'Guest'}
            </h1>
            <p className="text-sm text-gray-300 capitalize">
              {userData?.name || 'Welcome to Instagram'}
            </p>
          </div>
        </div>
        <div
          className="text-blue-400 px-4 py-2 cursor-pointer"
          onClick={handlelogout}
        >
          Logout
        </div>
      </div>

      <div className=" flex flex-col gap-[10px] p-[10px] ">
        <p className="text-white text-6 font-semibold  px-4">Suggested User </p>
        {suggestedUsers?.map((user, key) => (
          <div
            className="flex justify-between items-center px-4 py-2 border-b border-gray-500 mx-2  "
            key={user._id}
          >
            <div
              className="flex gap-2"
              onClick={() =>
                navigate(`/getuserprofile/${suggestedUsers[key].username}`)
              }
            >
              <div className="w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden cursor-pointer">
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <MdPerson size={40} className="text-white" />
                )}
              </div>
              <div className="flex flex-col items-start justify-center cursor-pointer">
                <h1 className="text-lg font-semibold text-white ">
                  {suggestedUsers[key].username}
                </h1>
                <p className="text-sm text-gray-300">
                  {suggestedUsers[key].name}
                </p>
              </div>
            </div>
            <div className="text-black bg-white rounded-xl px-6 py-2 cursor-pointer">
              Follow
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Left
