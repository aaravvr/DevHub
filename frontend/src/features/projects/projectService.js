import axiosInstance from './../../api/axiosInstance'

const API_URL = '/projects/'

// Create a project
const createProject = async (projectData) => {
    const response = await axiosInstance.post(API_URL, projectData)
    return response.data
}

// Get projects
const getAllProjects = async () => {
    const response = await axiosInstance.get(API_URL)
    //console.log('HERE BLEDGE', response.data)
    return response.data
}

const getProjectById = async (id) => {
  const response = await axiosInstance.get(API_URL + id)
  return response.data
}


// Delete Project
const deleteProject = async (id) => {
  const response = await axiosInstance.delete(API_URL + id)
  return response.data
}

// Get user's projects
const getUserProjects = async () => {
    const response = await axiosInstance.get(API_URL + 'user')
    return response.data
}

// Update project
const updateProject = async (id, updatedData) => {
    const response = await axiosInstance.put(API_URL + id, updatedData)
    return response.data
}

// Reset selected project
const resetSelectedProject = () => {
  return null
}


const projectService = {
    createProject,
    getAllProjects,
    deleteProject,
    getProjectById,
    getUserProjects,
    updateProject,
    resetSelectedProject
}

export default projectService