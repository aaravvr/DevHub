const asyncHandler = require('express-async-handler')

const Project = require('../models/projectModel')

const getProjects = asyncHandler(async (req, res) => {
  const project = await Project.find({ user: req.user.id })

  res.status(200).json(project)
})

const createProject = asyncHandler( async (req, res) => {
  res.status(201).json({ message: 'Create a project' });
})

module.exports = {
  getProjects,
  createProject,
};