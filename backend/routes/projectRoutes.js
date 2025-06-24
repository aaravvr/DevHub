const express = require('express');
const router = express.Router();
const { getAllProjects, createProject, getProjectById, updateProjects, deleteProjects, getUserProjects, getProjectsByLoggedInUser, addCommentToProject } = require('../controller/projectController');
const { protect } = require('../middleware/authMiddleware');


// GET /api/projects
router.get('/', getAllProjects);

// POST /api/projects
router.post('/', protect, createProject);

// GET /api/projects/my
router.get('/my', protect, getProjectsByLoggedInUser);

// POST /api/projects/:id/comments
router.post('/:id/comments', protect, addCommentToProject);

// /api/projects/:id
router.route('/:id')
    .get(getProjectById) // GET 
    .put(protect, updateProjects) // PUT
    .delete(protect, deleteProjects) // DELETE

// GET /api/projects/user
router.get('/user', protect, getUserProjects); 


module.exports = router;