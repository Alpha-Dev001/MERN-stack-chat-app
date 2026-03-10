import React, { useState, useEffect } from 'react'
import assets from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useSocketContext } from '../context/SocketContext'
import { messagesAPI } from '../lib/api'
import toast from 'react-hot-toast'

function Sidebar({ selectedUser, setSelectedUser }) {
  const navigate = useNavigate();
  const { onlineUsers } = useSocketContext();
  const [users, setUsers] = useState([]);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await messagesAPI.getUsers();
        if (res.data.success) {
          setUsers(res.data.users);
          setUnseenMessages(res.data.unseenMessages || {});
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (!selectedUser) return
    // Refresh unseen counts after selecting a user (messages become seen)
    const refresh = async () => {
      try {
        const res = await messagesAPI.getUsers();
        if (res.data.success) {
          setUnseenMessages(res.data.unseenMessages || {});
        }
      } catch (error) {
        console.error('Failed to refresh unseen messages:', error);
      }
    }

    refresh();
  }, [selectedUser]);

  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className='bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white'>
        <div className='flex justify-center items-center h-full'>
          <div>Loading users...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ''}`}>
      <div className="pb-5">
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt="logo" className='max-w-40' />
          <div className='relative py-2 group'>
            <img src={assets.menu_icon} alt="Menu" className='max-h-5 cursor-pointer' />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100 hidden group-hover:block'>
              <p onClick={() => navigate('/profile')} className='cursor-pointer text-sm'>Edit Profile</p>
              <hr className='my-2 border-t border-gray-500' />
              <p onClick={handleLogout} className='cursor-pointer text-sm'>Logout</p>
            </div>
          </div>
        </div>

        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt="Search" className='w-3' />
          <input
            type="text"
            className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
            placeholder='Search User...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className='flex flex-col mt-4'>
          {filteredUsers.map((user) => (
            <div
              onClick={() => { setSelectedUser(user) }}
              key={user._id}
              className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && 'bg-[#282142]/50'}`}
            >
              <div className='relative'>
                <img src={user?.profilePic || assets.avatar_icon} alt="profile pic" className='w-8.75 aspect-square rounded-full' />
                {onlineUsers.includes(user._id) && (
                  <span className='absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-[#8185B2]/10'></span>
                )}
              </div>
              <div className='flex flex-col leading-5 flex-1'>
                <p className='truncate'>{user.fullName}</p>
                <span className={`text-xs ${onlineUsers.includes(user._id) ? 'text-green-400' : 'text-neutral-400'}`}>
                  {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                </span>
              </div>
              {unseenMessages[user._id] > 0 && (
                <div className='min-w-[20px] min-h-[20px] flex items-center justify-center bg-violet-500 text-white text-xs rounded-full px-2'>
                  {unseenMessages[user._id]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
