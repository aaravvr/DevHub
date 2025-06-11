// frontend/src/pages/FeaturePage.jsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

function FeaturePage() {
  const { id } = useParams();
  const [feature, setFeature] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeature = async () => {
      try {
        const response = await axios.get(`/api/features/${id}`);
        setFeature(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load feature.');
        setLoading(false);
      }
    };

    fetchFeature();
  }, [id]);

  if (loading) return <p className="text-center mt-6">Loading...</p>;
  if (error) return <p className="text-center mt-6 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">{feature.title}</h1>
      <p className="text-gray-700">{feature.desc}</p>
    </div>
  );
}

export default FeaturePage;