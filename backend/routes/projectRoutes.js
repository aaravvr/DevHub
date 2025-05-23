const express = require('express');
const router = express.Router();
const { getProjects, createProject, getProjectById, updateProjects, deleteProjects, getUserProjects } = require('../controller/projectController');
const { protect } = require('../middleware/authMiddleware')


// GET /api/projects
router.get('/', protect, getProjects);

// POST /api/projects
router.post('/', protect, createProject);

// /api/projects/:id
router.route('/:id')
    .get(protect, getProjectById) // GET 
    .put(protect, updateProjects) // PUT
    .delete(protect, deleteProjects) // DELETE


module.exports = router;