// Import mongoose
const mongoose = require('mongoose')

// Create chatspace model
const chatspaceSchema = new mongoose.Schema({
  feature: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feature',
    required: true
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }]
});

module.exports = mongoose.model('Chatspace', chatspaceSchema);