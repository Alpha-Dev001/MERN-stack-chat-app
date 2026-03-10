import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatConatainer from '../components/ChatConatainer'
import RightSidebar from '../components/RightSidebar'
import { useChatContext } from '../context/ChatContext'

function HomePage() {
  const { selectedUser, selectUser } = useChatContext()

  return (
    <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
      <div className={`backdrop-blur-xl border border-gray-600 rounded-2xl overflow-hidden 
        h-full grid grid-cols-1 relative ${selectedUser ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
        <Sidebar selectedUser={selectedUser} setSelectedUser={selectUser} />
        <ChatConatainer selectedUser={selectedUser} setSelectedUser={selectUser} />
        <RightSidebar selectedUser={selectedUser} setSelectedUser={selectUser} />
      </div>
    </div>
  )
}

export default HomePage
