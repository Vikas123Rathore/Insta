import React, { useState, useRef, useEffect } from 'react'
import { IoMdHome } from 'react-icons/io'
import { FaVideo } from 'react-icons/fa'
import { FaPlus } from 'react-icons/fa6'
import { CgProfile } from 'react-icons/cg'
import { FiSend } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { FaRegImages } from 'react-icons/fa6'
import VideoPlayer from './VideoPlayer'
import axios from 'axios'
import { useDispatch } from 'react-redux'

const Navbar = () => {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const fileRef = useRef()
  const dispatch = useDispatch()
  const [frontend, setFrontend] = useState('')
  const [backend, setBackend] = useState(null)
  const [uploadType, setUploadType] = useState('Story')
  const [mediaType, setMediaType] = useState('')
  const [caption, setCaption] = useState('')
  const serverUrl = 'http://localhost:5000'
  // 🔥 cleanup memory
  useEffect(() => {
    return () => {
      if (frontend) URL.revokeObjectURL(frontend)
    }
  }, [frontend])
  const [loading, setLoading] = useState(false)
  const handleChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // size limit (50MB)
    if (file.size > 500 * 1024 * 1024) {
      alert('File too large (max 50MB)')
      return
    }

    // Loop must be video
    if (uploadType === 'Loop' && !file.type.includes('video')) {
      alert('Loop must be a video')
      return
    }

    if (file.type.includes('image')) {
      setMediaType('image')
    } else {
      setMediaType('video')
    }

    setBackend(file)
    setFrontend(URL.createObjectURL(file))
  }

  const submitHandler = async () => {
    setLoading(true)
    try {
      const formdata = new FormData()
      formdata.append('media', backend)
      formdata.append('mediaType', mediaType)
      formdata.append('caption', caption)
      const res = await axios.post(
        serverUrl + '/api/post/createpost',
        formdata,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      )
      dispatch(setPost(res.data))
      console.log(res.data)
      setLoading(false)
      navigate('/')
      setOpen(false)
    } catch (error) {
      setLoading(false)
      console.log(error + ' is the error in submitHandler of post upload')
    }
  }
  return (
    <>
      {/* Navbar */}
      <div className="flex justify-around items-center text-white rounded-xl shadow-[0_0_20px_rgba(0,0,0,0.25)] p-4 bg-black mx-6 border border-gray-600 z-50">
        <IoMdHome
          size={30}
          className="cursor-pointer"
          onClick={() => navigate('/')}
        />
        <FaVideo size={30} className="cursor-pointer" />
        <FaPlus
          size={30}
          className="cursor-pointer"
          onClick={() => setOpen(true)}
        />
        <FiSend size={30} className="cursor-pointer" />
        <CgProfile size={30} className="cursor-pointer" />
      </div>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex flex-col items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-2xl h-[60vh] rounded-xl flex justify-center items-center flex-col gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="w-full h-[14%] flex items-center justify-around font-semibold rounded-xl text-black bg-white">
              {['Story', 'Post', 'Loop'].map((type) => (
                <div
                  key={type}
                  className={`cursor-pointer px-6 py-2 rounded-xl hover:bg-gray-400 hover:text-white ${
                    uploadType === type && 'bg-black text-white'
                  }`}
                  onClick={() => setUploadType(type)}
                >
                  {type}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="flex flex-1 justify-center items-center bg-gray-600 rounded-2xl flex-col w-1/2 h-full overflow-hidden">
              <input type="file" hidden ref={fileRef} onChange={handleChange} />

              {frontend ? (
                <div className="w-full flex items-center justify-center overflow-hidden m-4 rounded-xl gap-6 flex-col cursor-pointer">
                  {mediaType === 'image' && (
                    <img
                      src={frontend}
                      alt="preview"
                      className="max-h-[180px] w-[400px] rounded-lg object-cover"
                    />
                  )}

                  {mediaType === 'video' && <VideoPlayer media={frontend} />}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center cursor-pointer w-1/2 h-full">
                  <FaRegImages
                    size={40}
                    onClick={() => fileRef.current.click()}
                  />
                  <p
                    className="text-white text-[20px] mt-4"
                    onClick={() => fileRef.current.click()}
                  >
                    Click to upload photos or videos
                  </p>
                </div>
              )}
            </div>
            {/* Caption */}
            {['Story', 'Post'].includes(uploadType) && (
              <input
                type="text"
                placeholder={`Write caption for your ${uploadType}`}
                className="w-1/2 px-6 py-4 rounded-xl border-b border-black outline-none bg-white text-black mt-6"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
              />
            )}

            {/* Upload Button */}
            <button
              className="mt-6 px-6 py-2 bg-blue-500 rounded-xl text-white font-semibold hover:bg-blue-600 w-[160px]"
              onClick={submitHandler}
            >
              {loading ? 'Uploading...' : `Upload ${uploadType}`}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
