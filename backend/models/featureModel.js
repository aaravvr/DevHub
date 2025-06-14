// Import mongoose
const mongoose = require('mongoose')

// Create feature model
const featureSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  desc: String,
  // Status can be updated by creator
  status: {
    type: String,
    enum: ['Active', 'Completed'],
    default: 'Active'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  // All proposals submitted for this feature 
  proposals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal'
  }],
  // Chatspace for the feature
  chatspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chatspace'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  votes: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    value: Number
  }]
}, { timestamps: true });

module.exports = mongoose.model('Feature', featureSchema);