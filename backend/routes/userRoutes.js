const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe, updateMe, getUserById, } = require('../controller/userController')
// protect used to check for authentication
const {protect} = require('../middleware/authMiddleware');


router.post('/', registerUser);

router.post('/login', loginUser);

router.get('/me', protect, getMe);

router.put('/me', protect, updateMe);

router.get('/public/:id', getUserById);

module.exports = router;
