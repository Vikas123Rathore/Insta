import React from 'react'
import { useSelector } from 'react-redux'
import { MdPerson } from 'react-icons/md'
const Story = () => {
    const userData = useSelector((state) => state.user.user)
  return (
    <div>
        <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden  ">
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
             <h2 className='text-white truncate'>your story</h2>
    </div>
  )
}

export default Story
