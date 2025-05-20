const express = require('express');
const router = express.Router();
const { getProjects, createProject } = require('../controller/projectController');

const { protect } = require('../middleware/authMiddleware')

// GET /api/projects
router.get('/', protect, getProjects);

// POST /api/projects
router.post('/', protect, createProject);

module.exports = router;