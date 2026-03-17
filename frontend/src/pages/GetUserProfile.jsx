import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { MdPerson } from 'react-icons/md'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUser } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'
const GetUserProfile = () => {
  const profilePictureUrl = null
  const serverUrl = 'http://localhost:5000'
  const { username } = useParams()
  const dispatch = useDispatch()
  const { profileData } = useSelector((state) => state.user)
  const { user } = useSelector((state) => state.user)
  const navigate = useNavigate()
  const handleprofile = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getuserprofile/${username}`,
        { withCredentials: true },
      )
      dispatch(setProfileData(result.data))
      console.log('res in getUserProfile', result.data)
    } catch (error) {
      console.log('error in getUserProfile controller', error)
    }
  }

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
  useEffect(() => {
    handleprofile()
  }, [username])
  return (
    <div className="w-full max-h-[100vh] bg-black flex  items-start justify-start px-4 py-4  ">
      <div className="w-[25%] ">
        <div
          className="w-25 h-25 rounded-full text-white cursor-pointer overflow-hidden"
          onClick={() => navigate('/')}
        >
          <FaArrowLeft size={25}/>
        </div>
      </div>
      <div className="w-[50%] flex justify-center items-center flex-col gap-[20px] mt-24">
        <h1 className="text-white text-semibold text-xl truncate w-40">
          {profileData?.user.username || 'Username'}
        </h1>
        <div className="flex justify-center gap-[8px]">
          {/* profile div */}
          <div>
            <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {profileData ? (
                <img
                  src={profileData.user.profileImage}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <MdPerson size={40} className="text-white" />
              )}
            </div>
          </div>
          {/* user details */}
          <div className="flex flex-col justify-start items-start">
            {/* <h1 className="text-white text-semibold text-xl">the_anita123</h1> */}
            <h1 className="text-white font-bold text-xl">
              {profileData?.user.name || 'Name'}
            </h1>
            <h3 className="text-white">
              {profileData?.user.bio || 'This is the user bio. '}
            </h3>
            <h2 className="uppercase text-white">
              {profileData?.user.profession || 'Profession'}
            </h2>
          </div>
        </div>
        <div className="flex justify-center items-center gap-[40px] px-[20%] pt-[8px] text-white">
          <div className="flex flex-col text-white items-start">
            <h1 className="text-white text-[20px] font-semibold">100</h1>
            <h2 className="text-white text-[14px]">Posts</h2>
          </div>
          <div className="flex flex-col text-white items-start">
            <h1 className="text-white text-[20px] font-semibold">2</h1>

            <h2 className="text-white text-[14px]">Followers</h2>
          </div>
          <div className="flex flex-col text-white items-start">
            <h1 className="text-white text-[20px] font-semibold">10</h1>
            <h2 className="text-white text-[14px]">Following</h2>
          </div>
        </div>
        {user && user.username === profileData?.user.username ? (
          <button
            className="px-4 py-2 bg-blue-500 text-gray-800 rounded-xl"
            onClick={() => navigate('/edit')}
          >
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-4 justify-center items-center">
            <button className="px-6 py-2 bg-blue-500 text-white rounded-xl">
              Follow
            </button>
            <button className="px-4 py-2 bg-gray-500 text-white rounded-xl">
              Message
            </button>
          </div>
        )}

        <div className='w-1/2 bg-white  h-screen overflow-y-auto'>

        </div>
      </div>
      <div className="w-[25%] flex  justify-end">
        <div
          className="text-black bg-white rounded-xl px-6 py-2 cursor-pointer"
          onClick={handlelogout}
        >
          Logout
        </div>
      </div>
    </div>
  )
}

export default GetUserProfile
