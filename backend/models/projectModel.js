// Import mongoose
const mongoose = require('mongoose')

// Create user model
const projectSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please enter project title'],
        maxlength: [25, 'Max 25 characters']
    }, 
    desc: {
        type: String,
        required: [true, 'Please enter project description'],
        maxlength: [200, 'Max 200 characters']
    },
    access_type: {
        type: String,
        enum: ['public', 'private']
    },
    tech_stack: [String],
    tags: {
        type: [String],
        // Validates arr length is less than or equal 8
        validate: {
            validator: val => val.length <= 8,
            message: 'Max 8 tags allowed'
        }
    },
    features_wanted: [
        // Array of objects (features) title and desc
        {
            title: {
                type: String,
                trim: true,
            },
            desc: {
                type: String,
                trim: true,
            }
        }
    ],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    github_repo: {
        // Extracted from currently logged in user info
        owner: {
            type: String,
            required: true,
            trim: true,
            match: /^[\w.-]+$/, // GitHub usernames can contain letters, numbers, underscores, hyphens, dots
        },
        // Extracted from url
        repo: {
            type: String,
            required: true,
            trim: true,
            match: /^[\w.-]+$/, // Same rules for repo name
        },
        url: {
            type: String,
            required: true,
            match: /^https:\/\/github\.com\/[\w.-]+\/[\w.-]+$/,
        }
    },
    // Added file tree to store tree + hashmap data structure of repository
    fileTree: {
        type: [mongoose.Schema.Types.Mixed],
        default: []
    },
}, 
{
    timestamps: true
})

module.exports = mongoose.model('Project', projectSchema)