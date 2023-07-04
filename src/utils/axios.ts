import axios from 'axios';

const URL =
  process.env.NODE_ENV === 'development' ? 'http://localhost:3333/' : 'https://autofleet-challenge.onrender.com/';

const axiosinstance = axios.create({
  baseURL: URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosinstance;
