const express = require('express');
const router = express.Router();
const { getAllProjects, createProject, getProjectById, updateProjects, deleteProjects, getUserProjects } = require('../controller/projectController');
const { protect } = require('../middleware/authMiddleware')


// GET /api/projects
router.get('/', protect, getAllProjects);

// POST /api/projects
router.post('/', protect, createProject);

// /api/projects/:id
router.route('/:id')
    .get(protect, getProjectById) // GET 
    .put(protect, updateProjects) // PUT
    .delete(protect, deleteProjects) // DELETE

// GET /api/projects/user
router.get('/user', protect, getUserProjects) 


module.exports = router;