import axios from 'axios';


const axiosInstance = axios.create({
   // baseURL: 'http://127.0.0.1:8000',
   baseURL: 'pensi-api-production-production.up.railway.app',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    withCredentials: true,
});

export default axiosInstance;