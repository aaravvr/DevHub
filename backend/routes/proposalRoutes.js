const express = require('express');
const router = express.Router();
const { getAllProposals, getProposalById, getUserProposals, createProposal, deleteProposal, updateProposal } = require('../controller/proposalController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/proposals/user
router.get('/user', protect, getUserProposals);

// GET /api/proposals/:id
router.get('/:id', getProposalById);

// POST /api/proposals
router.post('/', protect, createProposal);

// DELETE /api/proposals/:id
router.delete('/:id', protect, deleteProposal);

// UPDATE /api/proposals/:id
router.put('/:id', protect, updateProposal);

module.exports = router;