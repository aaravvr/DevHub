import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { deleteFeature, markFeatureCompleted } from '../features/featuresLogic/featureSlice';
import { useNavigate, Link } from 'react-router-dom';
import { getProposalsByFeature } from '../features/proposals/proposalSlice';
import ProposalCard from '../components/ProposalCard';
import AddProposalModal from '../components/AddProposalModal';

function FeaturePage() {
  const { id } = useParams();
  const [feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const proposals = useSelector((state) => state.proposals?.proposals.proposals || []);

  //console.log("PROPOSALS", proposals, Array.isArray(proposals));

  useEffect(() => {
    const getFeature = async () => {
      try {
        const response = await axios.get(`/api/features/${id}`);
        setFeature(response.data);
        dispatch(getProposalsByFeature(id));
        setLoading(false);
      } catch (err) {
        setError('Failed to load feature.');
        setLoading(false);
      }
    };

    getFeature();
  }, [id, dispatch]);

  useEffect(() => {
    if (!showModal) {
      dispatch(getProposalsByFeature(id));
    }
  }, [showModal, id, dispatch]);

  const handleComplete = () => {
    if (window.confirm('Mark this feature as completed?')) {
      dispatch(markFeatureCompleted(id));
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this feature?')) {
      dispatch(deleteFeature(id)).then(() => navigate('/'));
    }
  };

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="w-full p-6">
      <h1 className="text-3xl font-bold mb-2">
        {feature.title}
        <span className={`ml-3 px-2 py-1 rounded text-xs font-semibold ${ feature.status === 'Completed' ? 'bg-gray-600' : 'bg-green-600' }`}>
          {feature.status}
        </span>
      </h1>
      <p className="text-gray-700">{feature.desc}</p>
      <div className="flex gap-4 mt-4">
        <button onClick={handleDelete} disabled={feature.status === 'Completed'} className={`px-4 py-2 rounded text-white ${ feature.status === 'Completed' ? 'bg-gray-700 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700' }`} >
          Delete Feature
        </button>

        {user &&
          user._id === feature.creator._id &&
          feature.status !== 'Completed' && (
            <button onClick={handleComplete} className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white" >
              Mark Completed
            </button>
          )}
      </div>
      <div className="mt-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Proposals</h2>
          {feature.status !== 'Completed' && (
            <button onClick={() => setShowModal(true)} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" >
              Add Proposal
            </button>
          )}
        </div>
        {showModal && (
          <AddProposalModal featureId={id} onClose={() => setShowModal(false)} />
        )}
        <div className="space-y-4">
          {Array.isArray(proposals) ? (
            proposals.length > 0 ? (
              proposals.map((proposal) => (
                <div key={proposal._id}>
                  <div>
                    <Link to={`/proposals/${proposal._id}`} state={{ proposal }}>
                      <ProposalCard proposal={proposal} />
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No proposals available.</p>
            )
          ) : (
            <p className="text-gray-500">Loading proposals...</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeaturePage;