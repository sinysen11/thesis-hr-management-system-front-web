import axios from 'axios';
import router from '@/router';
import { getToken } from '@/services/authentication';

// const whiteListReturnError = [
//   'users/login', // ✅ Corrected from 'users/signin'
//   'sys_auth/api/verify-api'
// ];

// Create Axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || 'http://localhost:3000/api',
  timeout: 300000
});

// const whiteListReturnError = [
//   'users/login', // Correctly matches the login endpoint
//   'sys_auth/api/verify-api'
// ];

service.interceptors.request.use(
  async (config) => {
    const token = (await getToken()) || '';
    console.log('Config::', config);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  async (error) => {
    const { response } = error;

    if (response?.status === 401) {
      console.error('Unauthorized: Redirecting to login');
      await router.replace({ name: 'login' });
      return Promise.reject(new Error('Unauthorized access'));
    } else if (response?.status === 403) {
      console.error('Forbidden: Redirecting to home');
      const routeTo = router?.history?.pending?.name || '';
      if (!router || routeTo !== '/') {
        await router.replace({ path: '/' });
      }
      return Promise.reject(new Error('Forbidden access'));
    }

    const errorMessage =
      response?.data?.message || error.message || 'An error occurred';
    console.error('Response error:', errorMessage, error);
    return Promise.reject(new Error(errorMessage));
  }
);
export default service;
