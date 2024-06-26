// axios.js
import axios from 'axios';

// Access token 설정
const accessToken = localStorage.getItem('accessToken')

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  withCredentials: true // Include this if your server uses cookies for auth
});

export default AxiosInstance;
