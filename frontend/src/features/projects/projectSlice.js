import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import projectService from './projectService'

const initialState = {
    projects: [],
    userProjects: [],
    selectedProject: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

// Create project function
export const createProject = createAsyncThunk('projects/create', 
    async (projectData, thunkAPI) => {
        try {  
            return await projectService.createProject(projectData)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Get all projects, regardless of user
export const getAllProjects = createAsyncThunk('projects/getAll', 
    async (_, thunkAPI) => {
        try {       
            // No token passed as anyone should be able to access (even without login)
            return await projectService.getProjects()
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Get project by id
export const getProjectById = createAsyncThunk('projects/:id', 
    async(id, thunkAPI) => {
        try {           
            return await projectService.getProjectById(id)
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

// Delete user project
export const deleteProject = createAsyncThunk(
    'projects/delete',
    async (id, thunkAPI) => {
      try {        
        return await projectService.deleteProject(id)
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
    }
  )

// Update user project
export const updateProject = createAsyncThunk(
    'projects/update',
    async ({id, projectData}, thunkAPI) => {
      try {     
        return await projectService.updateProject(id, projectData)
      } catch (error) {
        const message =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString()
        return thunkAPI.rejectWithValue(message)
      }
    }
  )

// Get all projects with user as creator
export const getUserProjects = createAsyncThunk(
    'projects/user', 
    async (_, thunkAPI) => {
      try {
        return await projectService.getUserProjects()
      } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
      }
    }
  )

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        reset: (state) => {
            state.projects = []
            state.selectedProject = null
            state.isLoading = false
            state.isSuccess = false
            state.isError = false
            state.message = ''
        },
        resetSelectedProject: (state) => {
            state.selectedProject = null
        }
    }, 

    extraReducers: (builder) => {
        builder
            .addCase(createProject.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                // Addd the project to projects list for that user
                state.projects.push(action.payload)
            })
            .addCase(createProject.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getAllProjects.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAllProjects.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.projects = action.payload
            })
            .addCase(getAllProjects.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteProject.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteProject.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.projects = state.projects.filter((project) => project._id !== action.payload.id)
            })
            .addCase(deleteProject.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getProjectById.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getProjectById.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.selectedProject = action.payload 
            })
            .addCase(getProjectById.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })    
            .addCase(getUserProjects.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getUserProjects.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.userProjects = action.payload 
            })
            .addCase(getUserProjects.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })  
            .addCase(updateProject.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.selectedProject = action.payload 
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })  
    }
})

export const {reset, resetSelectedProject} = projectSlice.actions
export default projectSlice.reducer