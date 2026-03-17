import React, { useState } from 'react'
import logo from '../assets/logo.png'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setUser } from '../redux/userSlice'
const Login = () => {
  let [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
let dispatch=useDispatch()
let serverUrl = "http://localhost:5000"
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    setLoading(true)
    try {
      e.preventDefault()
      if (isLogin) {
        
        const result = await axios.post(
          `${serverUrl}/api/auth/login`,
          { username, password },
          {
            withCredentials: true,
          },
        )
        dispatch(setUser(result.data))
        setName('')
        setEmail('')
        setUsername('')
        setPassword('')
        navigate('/')
          setLoading(false)

      } else {
        const result = await axios.post(
          `${serverUrl}/api/auth/register`,
          { name, username, email, password },
          {
            withCredentials: true,
          },
        )
          dispatch(setUser(result.data))
        setName('')
        setUsername('')
        setEmail('')
        setPassword('')
        setIsLogin(true)
        console.log(result.data)
          setLoading(false)
      }

    } catch (error) {
      setLoading(false)
      console.error('Error during authentication:', error)
    }
  }

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center py-10 md:py-0">
      <div className="max-w-4xl w-[90%] md:flex bg-white rounded-xl shadow-lg overflow-hidden border border-gray-600">
        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-10 flex flex-col justify-center ">
          <h1 className="text-3xl font-semibold mb-4 bg-gradient-to-r from-pink-500 to-violet-500  text-transparent bg-clip-text">
            {isLogin ? 'Login to Your Account' : 'Create a New Account'}
          </h1>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <label
              className={`flex flex-col text-gray-700 ${isLogin ? 'hidden' : ''}`}
            >
              Name
              <input
                type="text"
                placeholder="Enter your name"
                className="mt-1 p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>

            <label className="flex flex-col text-gray-700">
              Username
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </label>

            <label
              className={`flex flex-col text-gray-700 ${isLogin ? 'hidden' : ''}`}
            >
              Email
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </label>

            <label className="flex flex-col text-gray-700">
              Password
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-3 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />

            </label>

            <button
              className="w-full mt-4 bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition font-semibold outline-none focus:ring-2 focus:ring-blue-500"
              type="submit"
            >
              {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
            </button>

            <p className="text-md text-gray-600 mt-2 text-center">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <span
                className="text-blue-500 cursor-pointer hover:underline"
                onClick={() => setIsLogin(!isLogin)}
              >
                Sign Up
              </span>
            </p>
          </form>
        </div>

        {/* Right - Logo / Image */}
        <div className="hidden md:flex w-1/2 bg-black items-center justify-center rounded-l-2xl relative flex-col">
          {/* Logo */}
          <img
            src={logo}
            alt="Logo"
            className="w-3/4 h-3/4 object-contain z-10"
          />

          {/* Overlay Text */}
          <p className="absolute bottom-10 text-white text-center text-lg font-semibold px-4 bg-gradient-to-r from-pink-500 to-violet-500  text-transparent bg-clip-text">
            Not just a Platform. It's just a vibe!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
