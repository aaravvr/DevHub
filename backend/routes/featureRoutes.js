const { getAllProposals, createProposal } = require('../controller/proposalController');
const express = require('express');
const router = express.Router();
const { getAllFeatures, getFeatureById, createFeature, updateFeature, deleteFeature } = require('../controller/featureController');
const { protect } = require('../middleware/authMiddleware');

// Routes to get all proposals and create depend on feature
// Hence included in featureRoutes
router.route('/:featureId/proposals')
  .get(getAllProposals) // GET /api/features/:featureId/proposals
  .post(protect, createProposal); // POST /api/features/:featureId/proposals

// GET /api/features
router.get('/', getAllFeatures);

// GET /api/features/:id
router.get('/:id', getFeatureById);

// POST /api/features
router.post('/', protect, createFeature);

// PUT /api/features/:id
router.put('/:id', protect, updateFeature);

// DELETE /api/features/:id
router.delete('/:id', protect, deleteFeature);

module.exports = router;