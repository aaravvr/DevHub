// Import express handler for async error handling
const asyncHandler = require('express-async-handler')

const Feature = require('../models/featureModel');
const Project = require('../models/projectModel');
const Proposal = require('../models/proposalModel'); // Added import for Proposal

// @route   GET /api/features
// @desc    Get all features
// @access  Public
const getAllFeatures = asyncHandler(async (req, res) => {
  const features = await Feature.find().populate('creator', 'username').populate('proposals');
  res.json(features);
});

// @route   GET /api/features/:id
// @desc    Get a feature by ID
// @access  Public
const getFeatureById = asyncHandler(async (req, res) => {
  const feature = await Feature.findById(req.params.id).populate('creator', 'username').populate('proposals');
  if (!feature) {
    res.status(404);
    throw new Error('Feature not found');
  }
  res.json(feature);
});

// @route   POST /api/features
// @desc    Create a new feature
// @access  Private
const createFeature = asyncHandler(async (req, res) => {
  const { title, desc, project } = req.body;

  if (!title || !project) {
    res.status(400);
    throw new Error('Title and project are required');
  }

  const feature = await Feature.create({
    title,
    desc,
    creator: req.user._id,
    project
  });

  // Update project with new feature
  const projectBody = await Project.findById(project);
  if (projectBody) {
    projectBody.features.push(feature._id);
    await projectBody.save();
  }

  res.status(201).json(feature);
});

// @route   PUT /api/features/:id
// @desc    Update a feature
// @access  Private
const updateFeature = asyncHandler(async (req, res) => {
  const feature = await Feature.findById(req.params.id);

  if (!feature) {
    res.status(404);
    throw new Error('Feature not found');
  }

  if (feature.creator.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to update this feature');
  }

  const updatedFeature = await Feature.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updatedFeature);
});

// @route   DELETE /api/features/:id
// @desc    Delete a feature
// @access  Private
const deleteFeature = asyncHandler(async (req, res) => {
  const feature = await Feature.findById(req.params.id);

  if (!feature) {
    res.status(404);
    throw new Error('Feature not found');
  }

  if (feature.creator.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Not authorized to delete this feature');
  }

  // Delete all proposals under the feature first
  await Proposal.deleteMany({ feature: feature._id });

  // Delete feature from project
  const projectBody = await Project.findById(feature.project);
  if (projectBody) {
    projectBody.features = projectBody.features.filter(fId => fId.toString() !== feature._id.toString());
    await projectBody.save();
  }

  await feature.remove();
  res.json({ message: 'Feature removed' });
});

module.exports = {
  getAllFeatures,
  getFeatureById,
  createFeature,
  updateFeature,
  deleteFeature
};