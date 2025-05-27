const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// register new user
// POST /api/users
const registerUser = asyncHandler(async(req, res) => {
    const { full_name, username, email, password, role, github, techstack } = req.body

    if(!full_name || !username || !email || !password || !role) {
        res.status(400)
        throw new Error('Please add all fields')
    }

    //Check if user with same email already exists
    const emailExists = await User.findOne({ email })

    if(emailExists) {
        res.status(400)
        throw new Error('User already exists with this email')
    }
    //Check if user with same username already exists
    const usernameExists = await User.findOne({ username})

    if(usernameExists) {
        res.status(400)
        throw new Error('User already exists with this username')
    }

    //Check if user with same github profile already exists
    if(github) {
        const githubExists = await User.findOne({ github })
        if(githubExists) {
            res.status(400)
            throw new Error('Github profile is already linked to another user')
        }
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    //Create user
    const user = await User.create({
        full_name,
        username,
        email,
        password: hashedPassword,
        role,
        github,
        techstack
    })

    if(user) {
        res.status(201).json({
            _id: user.id,
            full_name: user.full_name,
            username: user.username,
            email: user.email,
            role: user.role,
            github: user.github,
            techstack: user.techstack,
            token: generateToken(user._id),
        })
    } else {
        res.status(400)
        throw new Error('Invalid user data')
    }
})

// authenticate new user
// POST /api/login
const loginUser = asyncHandler(async(req, res) => {
    const {username, password} = req.body

    //check for username
    const user = await User.findOne({username})

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            full_name: user.full_name,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(401)
        throw new Error('Invalid credentials')
    }
})

// Get user data
// GET /api/users/me
const getMe = asyncHandler(async (req, res) => {
    const {_id, full_name, username, email, role, github, bio, techstack} = await User.findById(req.user.id)

    res.status(200).json({
        id: _id,
        full_name,
        username,
        email,
        role,
        github,
        techstack,
    })
})

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}
module.exports = {
    registerUser,
    loginUser,
    getMe,
}