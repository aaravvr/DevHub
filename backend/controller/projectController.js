// Placeholder CRUD functions for projects

const getProjects = (req, res) => {
  res.status(200).json({ message: 'Get all projects' });
};

const createProject = (req, res) => {
  res.status(201).json({ message: 'Create a project' });
};

module.exports = {
  getProjects,
  createProject,
};