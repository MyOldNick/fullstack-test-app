// TODO: change to react query for production

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  withCredentials: true,
});

export default api;
