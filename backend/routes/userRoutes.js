const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getMe,
    updateMe,
} = require('../controller/userController')

// protect used to check for authentication
const {protect} = require('../middleware/authMiddleware');
const { getUserProjects } = require('../controller/projectController');

router.post('/', registerUser)
router.post('/login', loginUser)
router.get('/me', protect, getMe)
router.put('/me', protect, updateMe)
router.get('/:id', protect, getUserProjects)


module.exports = router;
