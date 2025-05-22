// Import express and dotenv
const express = require('express')
const dotenv = require('dotenv').config()

// Import error handler if server doesn't start properly
const {errorHandler} = require("./middleware/errorMiddleWare")

const { connectDB } = require('./config/db')

// Connect to either port 5001 (hidden in env) or 8000
const port = process.env.PORT || 8000

connectDB()

const app = express()

app.use(express.json())

// Use normal parser url
app.use(express.urlencoded({ extended: false }))

// Get all CRUD functions from project Routes 
app.use('/api/projects', require('./routes/projectRoutes'))

app.use('/api/auth', require('./routes/userRoutes'))

app.use(errorHandler)

app.listen(port, () => console.log(`server started on port ${port}`))