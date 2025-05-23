// Import mongoose
const mongoose = require('mongoose')

// Create user model
const userSchema = mongoose.Schema({
    full_name: {
        type: String,
        required: [true, 'Please enter name']
    }, 
    username: {
        type: String,
        unique: true,
        required: [true, 'Please enter username'],
        trim: true,
        // Ensures username only 1 word without unecessary special characters
        match: [ /^[\w.-]+$/, 'Username must only contain letters, numbers, underscores (_), hyphens (-), or dots (.)'],
        minlength: [4, "Must be atleast 6 characters long"]
    },
    email: {
        type: String,
        required: [true, 'Please enter email'],
        unique: true
    }, 
    password: {
        type: String,
        required: [true, 'Please enter password']
    },
    role: {
        type: String,
        enum: ["student", "employee", "company"],
        default: "basic"
    },
    // Template github info to store
    github: {
        id: String,                 // GitHub user ID
        username: String,           // GitHub username (for display)
        access_token: String,       // OAuth access token (store securely!)
        avatar_url: String,         // Profile picture
        profile_url: String         // e.g., https://github.com/username
    },
    bio: {
        type: String,
        trim: true,
        maxlength: [100, 'Max 100 characters']
    },
    tech_stack: [String]
}, 
{
    timestamps: true
})

module.exports = mongoose.model('User', userSchema)