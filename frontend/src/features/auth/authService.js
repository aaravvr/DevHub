import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL + '/api/users'

// Register user
const register = async (userData) => {
  const response = await axios.post(API_URL, userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
    localStorage.setItem('token', response.data.token)
  }

  return response.data
}

// Login user
const login = async (userData) => {
  const response = await axios.post(API_URL + '/login', userData)

  if (response.data) {
    localStorage.setItem('user', JSON.stringify(response.data))
    localStorage.setItem('token', response.data.token)
  }

  return response.data
}

// Logout user
const logout = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

// Get current user data
const getMe = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }

  const response = await axios.get(API_URL + '/me', config)
  return response.data
}

// Update user profile
const updateProfile = async (data, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  }

  const response = await axios.put('/api/users/me', data, config)
  return response.data
}

const authService = {
  register,
  login,
  logout,
  getMe, 
  updateProfile
}

export default authService
