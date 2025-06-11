const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')


// @route   POST /api/users
// @desc    Register User
// @access  Public
const registerUser = asyncHandler(async(req, res) => {
    const { full_name, username, email, password, role, github, techstack } = req.body;
    if(!full_name || !username || !email || !password || !role) {
        res.status(400)
        throw new Error('Please add all fields');
    };

    // Check if user with same email already exists
    const emailExists = await User.findOne({ email })

    if(emailExists) {
        res.status(400);
        throw new Error('User already exists with this email')
    }
    // Check if user with same username already exists
    const usernameExists = await User.findOne({ username});

    if(usernameExists) {
        res.status(400);
        throw new Error('User already exists with this username');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt)


    // console.log(full_name, username, email, hashedPassword, role, techstack);

    // Create user
    const user = await User.create({
        full_name,
        username,
        email,
        password: hashedPassword,
        role,
        github,
        techstack
    })

    // console.log("USER", user);

    if(user) {
        // Creates cookie to save user id
        // res.cookie('localUserId', user._id.toString(), {
        //     httpOnly: false,  
        //     secure: false,    
        //     maxAge: 24 * 60 * 60 * 1000, 
        // });
        console.log("CONTROLLER", user.github);
        res.status(201).json({
            _id: user.id,
            full_name: user.full_name,
            username: user.username,
            email: user.email,
            role: user.role,
            github: user.github,
            techstack: user.techstack,
            token: generateToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
})

// @route   POST /api/users
// @desc    Login User
// @access  Public
const loginUser = asyncHandler(async(req, res) => {
    const {username, password} = req.body

    //check for username
    const user = await User.findOne({username})

    if(user && (await bcrypt.compare(password, user.password))) {
        // Saves user id in session if they choose to add github later
        req.session.userId = user._id;

        res.json({
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
        res.status(401)
        throw new Error('Invalid credentials')
    }
})

// @route   GET /api/users/me
// @desc    Get Current User Info
// @access  Private
const getMe = asyncHandler(async (req, res) => {
    const {_id, full_name, username, email, role, github, techstack} = await User.findById(req.user.id)

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

// @route   PUT /api/users/me
// @desc    Update User Info
// @access  Private
const updateMe = asyncHandler(async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

  res.status(200).json({
    id: user._id,
    full_name: user.full_name,
    username: user.username,
    email: user.email,
    role: user.role,
    github: user.github,
    techstack: user.techstack,
  });
});

// @route   GET /api/users/:id
// @desc    Get User Info
// @access  Public
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.status(200).json(user)
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
    updateMe,
    getUserById,
}