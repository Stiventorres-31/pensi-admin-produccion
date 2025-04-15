import axios from 'axios';
import storage from '../storage/storage';

const axiosInstance = axios.create({
   // baseURL: 'http://127.0.0.1:8000',
   baseURL: storage.getAPI_URL(),
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export default axiosInstance;