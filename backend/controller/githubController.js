// controller/githubController.js
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

// @desc    Get list of repos for authenticated GitHub user
// @route   GET /api/github/repos
// @access  Private
const getUserRepos = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `token ${token}` }
    });

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch repositories', error: err.message });
  }
};

// @desc    Get list of branches for a specific repo
// @route   GET /api/github/repos/:owner/:repo/branches
// @access  Private
const getRepoBranches = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { owner, repo } = req.params;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const response = await axios.get(`https://api.github.com/repos/${owner}/${repo}/branches`, {
      headers: { Authorization: `token ${token}` }
    });

    res.status(200).json(response.data);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch branches', error: err.message });
  }
};

// @desc    Create a new branch in a GitHub repo
// @route   POST /api/github/create-branch
// @access  Private
const createBranch = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { repo, newBranchName, baseBranch } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    // Find the user by GitHub token
    const user = await require('../models/userModel').findOne({ 'github.access_token': token });

    if (!user || !user.github || !user.github.username) {
      return res.status(403).json({ message: 'GitHub user not linked or not found' });
    }

    const owner = user.github.username;

    // Step 1: Get the SHA of the base branch
    const branchRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${baseBranch}`,
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    const sha = branchRes.data.object.sha;

    // Step 2: Create a new reference (branch)
    const createRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/git/refs`,
      {
        ref: `refs/heads/${newBranchName}`,
        sha: sha,
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    res.status(201).json({ message: 'Branch created successfully', data: createRes.data });
  } catch (err) {
    console.error('Branch creation error:', err?.response?.data || err.message);
    res.status(500).json({ message: 'Failed to create branch', error: err.message });
  }
};

// @desc    Commit a file to a branch in a GitHub repo
// @route   POST /api/github/commit-proposal
// @access  Private
const commitProposalToBranch = async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const { repo, branch, filePath, content, commitMessage } = req.body;

  if (!token) {
    return res.status(401).json({ message: 'Missing token' });
  }

  try {
    const user = await require('../models/userModel').findOne({ 'github.access_token': token });

    if (!user || !user.github || !user.github.username) {
      return res.status(403).json({ message: 'GitHub user not linked or not found' });
    }

    const owner = user.github.username;

    // Get the SHA of the latest commit on the branch
    const refRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${branch}`,
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    const latestCommitSha = refRes.data.object.sha;

    // Get the tree SHA of the latest commit
    const commitRes = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/git/commits/${latestCommitSha}`,
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    const baseTreeSha = commitRes.data.tree.sha;

    // Create a new blob with file content
    const blobRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/git/blobs`,
      {
        content,
        encoding: 'utf-8',
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    const blobSha = blobRes.data.sha;

    // Create a new tree with the updated file
    const treeRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/git/trees`,
      {
        base_tree: baseTreeSha,
        tree: [
          {
            path: filePath,
            mode: '100644',
            type: 'blob',
            sha: blobSha,
          },
        ],
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    const newTreeSha = treeRes.data.sha;

    // Create a new commit
    const newCommitRes = await axios.post(
      `https://api.github.com/repos/${owner}/${repo}/git/commits`,
      {
        message: commitMessage,
        tree: newTreeSha,
        parents: [latestCommitSha],
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    const newCommitSha = newCommitRes.data.sha;

    // Update the reference of the branch to point to the new commit
    await axios.patch(
      `https://api.github.com/repos/${owner}/${repo}/git/refs/heads/${branch}`,
      {
        sha: newCommitSha,
      },
      {
        headers: { Authorization: `token ${token}` },
      }
    );

    res.status(200).json({ message: 'Commit pushed successfully' });
  } catch (err) {
    console.error('Commit error:', err?.response?.data || err.message);
    res.status(500).json({ message: 'Failed to commit', error: err.message });
  }
};

module.exports = {
  verifyRepo,
  getUserRepos,
  getRepoBranches,
  createBranch,
  commitProposalToBranch
};