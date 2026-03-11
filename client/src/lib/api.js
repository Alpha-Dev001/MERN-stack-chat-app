import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.token = token
    }
    return config
})

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

// Auth API calls
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    checkAuth: () => api.get('/auth/check'),
    updateProfile: (profileData) => api.post('/auth/update-profile', profileData)
}

// Messages API calls
export const messagesAPI = {
    getUsers: () => api.get('/messages/users'),
    getMessages: (userId) => api.get(`/messages/${userId}`),
    sendMessage: (userId, messageData) => api.post(`/messages/send/${userId}`, messageData),
    markAsSeen: (messageId) => api.put(`/messages/mark/${messageId}`),
    deleteMessage: (messageId) => api.delete(`/messages/${messageId}`),
    searchMessages: (userId, query) => api.get(`/messages/search/${userId}?query=${encodeURIComponent(query)}`)
}
