import axiosInstance from '../../api/axiosInstance';

// Commit code to a specific proposal branch
export const commitToProposalBranch = async ({ repoOwner, repoName, branchName, filePath, content, commitMessage, accessToken }) => {
  const response = await axiosInstance.post('/api/github/commit', {
    repoOwner,
    repoName,
    branchName,
    filePath,
    content,
    commitMessage,
    accessToken,
  });

  return response.data;
};
