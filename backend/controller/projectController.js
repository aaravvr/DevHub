// Import express handler for async error handling
const asyncHandler = require('express-async-handler')

const Project = require('../models/projectModel')

// @desc    Get projects
// @route   GET /api/projects
// @access  Private
const getAllProjects = asyncHandler( async (req, res) => {
  const projects = await Project.find().populate('creator', 'username full_name role')

  res.status(200).json({ projects });
});

// @desc    Get projects by id
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = asyncHandler( async (req, res) => {
  const project = await Project.findById(req.params.id).populate('creator', 'username full_name role')

  if (!project) {
    res.status(404)
    throw new Error('Project not found')
  }

  res.status(200).json(project)
})

// @desc    Get user projects
// @route   GET /api/movies/user/:id
// @access  Private
const getUserProjects = asyncHandler( async (req, res) => {
  const userProjects = await Project.find({ creator: req.user._id }).populate('creator', 'username full_name role')

  res.status(200).json(userProjects)
})

// @desc    Create projects
// @routes  POST /api/projects
// @access  Private
const createProject = asyncHandler( async (req, res) => {
    // Extract required fields
    const {title, desc, access_type, tech_stack, 
        tags, features_wanted, github_repo} = req.body

    // If no request body, or text in body, throw error
    if (!title || !desc || !req.user || !github_repo || !access_type) {
        res.status(400)
        throw new Error('Missing fields')
    }

    const project = await Project.create({
        title,
        desc, 
        access_type,
        tech_stack, 
        tags, 
        features_wanted, 
        creator: req.user._id, 
        github_repo 
    })

    res.status(201).json(project)
});

// @desc    Delete projects
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProjects = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id).populate('creator', 'username full_name role')

    if (!project) {
      res.status(400)
      throw new Error('Project not found')
    }

    // Only project creator can delete
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await project.deleteOne()

    res.status(200).json({ message: `Project with id ${req.params.id} deleted`})
})

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProjects = asyncHandler(async (req, res) => {

    const project = await Project.findById(req.params.id).populate('creator', 'username full_name role')
    if (!project) {
      res.status(400)
      throw new Error('Movie not found')
    }

    // Only project creator can update
    if (project.creator.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedProject = await Project.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    }).populate('creator', 'username full_name role')

    res.status(200).json(updatedProject)
})

// @desc   Get my projects
// @route  GET /api/projects/my-projects
// @access Private
const getProjectsByLoggedInUser = asyncHandler(async (req, res) => {
  const projects = await Project.find({ creator: req.user._id }).populate('creator', 'username full_name role')
  res.status(200).json(projects)
})

module.exports = {
  getAllProjects,
  createProject,
  deleteProjects,
  updateProjects,
  getProjectById, 
  getUserProjects,
  getProjectsByLoggedInUser
};