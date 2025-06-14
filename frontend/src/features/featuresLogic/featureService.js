import axios from 'axios';

const API_URL = '/api/features/';

// Create a feature
const createFeature = async (featureData, token) => {
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const response = await axios.post(API_URL, featureData, config);
  return response.data;
};

const deleteFeature = async (id, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.delete(`/api/features/${id}`, config);
  return response.data;
};

const featureService = {
  createFeature,
  deleteFeature,
};

export default featureService;
