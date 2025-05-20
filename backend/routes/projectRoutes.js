const express = require('express');
const router = express.Router();
const { getProjects, createProject } = require('../controllers/projectController');

// GET /api/projects
router.get('/', getProjects);

// POST /api/projects
router.post('/', createProject);

module.exports = router;