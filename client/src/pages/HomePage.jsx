import React, { useState } from 'react'
import Sidebar from '../components/Sidebar';
import ChatContainer from "../components/ChatContainer";
import Footer from "../components/Footer";


const Homepage = () => {

  return (
    <>
      <div className='flex w-full h-screen'>
        {/* <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}> */}
          <Sidebar />
          <ChatContainer />
          {/* <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser} /> */}
        {/* </div> */}
      </div>
      {/* <Footer /> */}
    </>
  )
}

export default Homepage
