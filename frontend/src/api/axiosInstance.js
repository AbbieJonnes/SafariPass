import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://safaripass-mwts.onrender.com/api',
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export default axiosInstance;