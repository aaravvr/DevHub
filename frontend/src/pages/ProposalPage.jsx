import React from 'react';
import { useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';

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

  if (!proposal) {
    return <div className="text-white p-8">Proposal not found.</div>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{proposal.title}</h1>
        <p className="mb-4 text-lg">{proposal.desc}</p>
        <div className="mb-4">
          <strong>Attachment:</strong>{' '}
          <a
            href={proposal.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 underline"
          >
            View Attachment
          </a>
        </div>
        <div className="mb-4">
          <strong>Proposer:</strong> {proposal.proposer?.username || 'Unknown'}
        </div>
        <div className="mb-4">
          <strong>Feature:</strong> {proposal.feature?.title || proposal.feature}
        </div>
        <div className="mb-4">
          <strong>Status:</strong> {proposal.status || 'Pending'}
        </div>
        {proposal.videoUrl && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-2">Demo Video</h2>
            <video controls className="w-full max-w-2xl">
              <source src={proposal.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalPage;