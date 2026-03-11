import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext()

export const useAuthContext = () => {
  return useContext(AuthContext)
}

export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        const res = await api.get('/auth/check')
        if (res.data.success) {
          setAuthUser(res.data.user)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (type, data) => {
    try {
      setLoading(true)
      const endpoint = type === 'signup' ? '/auth/signup' : '/auth/login'
      console.log('Making request to:', endpoint, 'with data:', data)
      const res = await api.post(endpoint, data)
      console.log('Response received:', res.data)

      if (res.data.success) {
        localStorage.setItem('token', res.data.token)
        setAuthUser(res.data.userData)
        return { success: true }
      } else {
        return { success: false, message: res.data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      console.error('Error response:', error.response?.data)
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed',
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAuthUser(null)
  }

  const updateProfile = async (data) => {
    try {
      const res = await api.post('/auth/update-profile', data)
      if (res.data.success) {
        setAuthUser(res.data.user)
        return { success: true }
      }
      return { success: false, message: res.data.message }
    } catch (error) {
      console.error('Profile update error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Profile update failed',
      }
    }
  }

  return (
    <AuthContext.Provider value={{ authUser, loading, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}
