const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
  feature: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Feature',
    required: true
  },
  proposer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: String,
  description: String,
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Proposal', proposalSchema);