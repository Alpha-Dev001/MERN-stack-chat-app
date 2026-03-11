import React, { useState } from 'react'
import assets from '../assets/assets'

const MessageSearch = ({ selectedUser, onSearch, onClear, isSearching }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim())
    }
  }

  const handleClear = () => {
    setSearchQuery('')
    onClear()
  }

  if (!selectedUser) return null

  return (
    <div className="p-3 border-b border-gray-600">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="flex-1 relative">
          <img src={assets.search_icon} alt="Search" className='absolute left-3 top-1/2 transform -translate-y-1/2 w-3 opacity-60' />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-8 py-2 bg-white/10 border border-gray-600 rounded-lg text-white text-sm placeholder-gray-400 focus:outline-none focus:border-violet-500"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
        <button
          type="submit"
          disabled={isSearching || !searchQuery.trim()}
          className="px-3 py-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-50 text-white text-sm rounded-lg transition-colors"
        >
          {isSearching ? '...' : 'Search'}
        </button>
      </form>
    </div>
  )
}

export default MessageSearch
