import axios from 'axios';
// import store from '../app/store';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

// Sets request header to token by default so we don't have to add 
// it each time we send a request
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  console.log("bledge: ", token)
  // const token = store.getState().auth.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance;