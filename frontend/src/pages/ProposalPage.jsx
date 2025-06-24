import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { deleteProposal } from '../features/proposals/proposalSlice';
import { commitCode } from '../features/github/githubSlice';

const ProposalPage = () => {
  const { proposalId } = useParams();
  const location = useLocation();
  const passedProposal = location.state?.proposal;

  console.log("STATE", location.state)

  const { proposals } = useSelector((state) => state.proposals);
  const proposalArray = Array.isArray(proposals) ? proposals : [];
  const proposalFromState = proposalArray.find((p) => p._id === proposalId);
  const proposal = passedProposal || proposalFromState;
  console.log("PROP", proposalId)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCommit = () => {
    if (!proposal) return;

    const commitData = {
      owner: proposal.owner, // assuming proposal has this
      repo: proposal.repo,   // assuming proposal has this
      branch: proposal.branchName, // use the saved branch
      message: "Committing proposal changes",
      content: proposal.content || btoa("Example content"), // base64 string
      path: proposal.filePath || "README.md",
    };

    dispatch(commitCode(commitData));
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this proposal?')) {
      dispatch(deleteProposal(proposal._id)).then(() => {
        navigate(`/features/${proposal.feature?._id || proposal.feature}`);
      });
    }
  };

  if (!proposal) {
    return <div className="text-white p-8">Proposal not found.</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h1 className="text-4xl font-bold mb-2">{proposal.title}</h1>
          <p className="text-lg">{proposal.desc}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-2">GitHub Repository</h2>
          <a
            href={proposal.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline break-all"
          >
            {proposal.githubUrl}
          </a>
        </div>

        {proposal.mediaUrl && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Media</h2>
            {proposal.mediaUrl.endsWith('.mp4') ? (
              <video controls className="w-full max-w-2xl rounded">
                <source src={proposal.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : (
              <img src={proposal.mediaUrl} alt="Proposal Media" className="w-full max-w-2xl rounded" />
            )}
          </div>
        )}

        {proposal.videoUrl && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Demo Video</h2>
            <video controls className="w-full max-w-2xl rounded">
              <source src={proposal.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        <div className="bg-gray-800 p-6 rounded-lg shadow-md space-y-2">
          <div>
            <strong>Proposer:</strong> {proposal.proposer?.username || 'Unknown'}
          </div>
          <div>
            <strong>Feature:</strong> {proposal.feature?.title || proposal.feature}
          </div>
          <div>
            <strong>Status:</strong> {proposal.status || 'Pending'}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-md text-right">
          <button
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Delete Proposal
          </button>
          <button
            onClick={handleCommit}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-4"
          >
            Commit to GitHub
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProposalPage;