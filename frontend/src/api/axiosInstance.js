import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
})

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  // const token = store.getState().auth.user?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/*
=======

  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}  
    config.headers.Authorization = `Bearer ${token}`
    //console.log("Token attached:", token)
  } else {
    //console.warn("No token found in localStorage")
  }
  return config
})
>>>>>>> main
*/

export default axiosInstance
