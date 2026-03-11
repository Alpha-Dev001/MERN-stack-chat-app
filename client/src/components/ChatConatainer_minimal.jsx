import React from 'react'

function ChatConatainer({ selectedUser, setSelectedUser }) {
  return selectedUser ? (
    <div className='h-full overflow-scroll relative backdrop-blur-lg'>
      <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
        <img src="" alt="" className='w-8 rounded-full' />
        <p className='flex-1 text-lg text-white'>{selectedUser?.fullName || 'User'}</p>
      </div>
      <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
        <div className="text-center text-gray-400 text-sm mt-8">
          Chat functionality temporarily disabled
        </div>
      </div>
    </div>
  ) : (
    <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
      <p className='text-lg font-medium text-white'>Chat anytime, anywhere</p>
    </div>
  )
}

export default ChatConatainer
