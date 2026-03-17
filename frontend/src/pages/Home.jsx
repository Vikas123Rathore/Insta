import React from 'react'
import Left from '../components/Left'
import Feed from '../components/Feed'
import Right from '../components/Right'

const Home = () => {
  return (
    <div className="bg-black flex w-full min-h-screen items-start justify-center ">
      <Left />
      <Feed />
      <Right />
    </div>
  )
}

export default Home
