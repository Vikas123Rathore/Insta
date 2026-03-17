import React, { useRef, useState } from 'react'
import { FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { MdPerson } from 'react-icons/md'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { ClipLoader } from 'react-spinners'

import { setUser } from '../redux/userSlice'
import { useDispatch } from 'react-redux'
const EditProfile = () => {
  const { user } = useSelector((state) => state.user)

  const [loading, setLoading] = useState(false)
  const [frontendImage, setFrontendImage] = useState(user?.profileImage || null)
  const [backendImage, setBackendImage] = useState(null)
  const [username, setUsername] = useState(user?.username || '')
  const [bio, setBio] = useState( '')
  const [gender, setGender] = useState( '')
  const [name, setName] = useState( '')
  const [profession, setProfession] = useState( '')
  const navigate = useNavigate()
  const inputImage = useRef()

  const handleImage = (e) => {
    const file = e.target.files[0]

    if (file) {
      setBackendImage(file)
      setFrontendImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('name', name)
      formData.append('bio', bio)
      formData.append('gender', gender)
      formData.append('profession', profession)
      if (backendImage) {
        formData.append('profilePicture', backendImage)
      }
      const res = await axios.put(
        'http://localhost:5000/api/user/editprofile',
        formData,
        { withCredentials: true },
      )
      console.log('Profile updated successfully', res.data)

      navigate(`/getuserprofile/${user.username}`)
      dispatch(setUser(res.data))
      setBio('')
      setGender('')
      setName('')
      setProfession('')
      setUsername('')
      setLoading(false)
    } catch (error) {
      console.log('error in updating profile', error)
      setLoading(false)
    }
  }

  return (
    <div className="w-full min-h-screen bg-black text-white flex flex-col gap-5 items-center">
      <div className="w-full h-[80px] flex items-center gap-[20px] px-[20px]">
        <FaArrowLeft
          className="text-white cursor-pointer w-[25px] h-[25px]"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-2xl font-bold ">Edit Profile</h1>
      </div>

      {/* Hidden File Input */}
      <input
        type="file"
        hidden
        ref={inputImage}
        accept="image/*"
        onChange={handleImage}
      />

      {/* Profile Image */}
      <div
        className="w-[100px] h-[100px] rounded-full bg-gray-500 flex items-center justify-center text-4xl text-white font-bold overflow-hidden cursor-pointer"
        onClick={() => inputImage.current.click()}
      >
        {frontendImage ? (
          <img
            src={frontendImage}
            alt="profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <MdPerson size={40} />
        )}
      </div>

      <div className="text-center text-blue-500">
        Change your profile picture
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-2 flex flex-col justify-center items-center gap-8 w-full"
      >
        <input
          type="text"
          className="w-full max-w-[400px] rounded-lg py-2 px-4 text-lg outline-none focus:border-2 border-red-300 text-black"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <input
          type="text"
          className="w-full max-w-[400px] rounded-lg py-2 px-4 text-lg outline-none focus:border-2 border-red-300 text-black"
          placeholder="Enter name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="text"
          className="w-full max-w-[400px] rounded-lg py-2 px-4 text-lg outline-none focus:border-2 border-red-300 text-black"
          placeholder="Enter bio"
          onChange={(e) => setBio(e.target.value)}
          value={bio}
        />
        <input
          type="text"
          className="w-full max-w-[400px] rounded-lg py-2 px-4 text-lg outline-none focus:border-2 border-red-300 text-black"
          placeholder="Enter gender"
          onChange={(e) => setGender(e.target.value)}
          value={gender}
        />
        <input
          type="text"
          className="w-full max-w-[400px] rounded-lg py-2 px-4 text-lg outline-none focus:border-2 border-red-300 text-black"
          placeholder="Enter profession"
          onChange={(e) => setProfession(e.target.value)}
          value={profession}
        />
        <button
          type="submit"
          className="bg-blue-300 px-6 text-gray-600 leading-loose hover:bg-blue-400 font-semibold py-2 border-2 border-gray-700 rounded-xl w-[160px]"
        >
          {loading ? <ClipLoader size={30} color="black" /> : 'Save Profile'}
        </button>
      </form>
    </div>
  )
}

export default EditProfile
