import React from 'react'

const LoadingSkeleton = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="bg-gray-300/20 rounded-lg h-4 w-3/4 mb-2"></div>
      <div className="bg-gray-300/20 rounded-lg h-4 w-1/2"></div>
    </div>
  )
}

export const MessageSkeleton = () => {
  return (
    <div className="flex gap-3 p-3 animate-pulse">
      <div className="w-8 h-8 bg-gray-300/20 rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="bg-gray-300/20 rounded-lg h-16 w-3/4"></div>
        <div className="bg-gray-300/20 rounded-lg h-4 w-1/4 self-end"></div>
      </div>
    </div>
  )
}

export const UserSkeleton = () => {
  return (
    <div className="flex items-center gap-3 p-3 animate-pulse">
      <div className="w-10 h-10 bg-gray-300/20 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="bg-gray-300/20 rounded h-4 w-32"></div>
        <div className="bg-gray-300/20 rounded h-3 w-16"></div>
      </div>
    </div>
  )
}

export const ChatSkeleton = () => {
  return (
    <div className="flex flex-col h-full animate-pulse">
      <div className="flex items-center gap-3 p-4 border-b border-gray-600">
        <div className="w-8 h-8 bg-gray-300/20 rounded-full"></div>
        <div className="flex-1">
          <div className="bg-gray-300/20 rounded h-4 w-32 mb-2"></div>
          <div className="bg-gray-300/20 rounded h-3 w-16"></div>
        </div>
      </div>
      <div className="flex-1 p-3 space-y-4">
        <MessageSkeleton />
        <MessageSkeleton />
        <MessageSkeleton />
      </div>
      <div className="p-3 border-t border-gray-600">
        <div className="bg-gray-300/20 rounded-full h-10"></div>
      </div>
    </div>
  )
}

export default LoadingSkeleton
