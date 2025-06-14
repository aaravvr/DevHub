// controllers/githubController.js
const axios = require('axios');

// @desc    Verifies if the user owns the GitHub repo
// @route   POST /api/github/verify-repo
// @access  Private
const verifyRepo = async (req, res) => {
  const { owner, repo } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: { Authorization: `token ${token}` },
    });

    res.status(200).json({ valid: true });
  } catch (err) {
    res.status(403).json({ valid: false, message: 'Unauthorized or repo not found' });
  }
};

module.exports = { verifyRepo };