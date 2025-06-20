import axios from 'axios';
import router from '@/router';
import store from '@/store';
import APIS from '@/constants/apis';
import { getToken } from '@/services/authentication';

const whiteListReturnError = [
  APIS.users.signin.url, // ✅ Corrected
  'sys_auth/api/verify-api'
];

// Create Axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || 'http://localhost:3000/api',
  timeout: 300000
});

// Request Interceptor
service.interceptors.request.use(
  async (config) => {
    const token = (await getToken()) || '';
    config.headers.Authorization = `bearer ${token}`;
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  async (response) => {
    return response.data;
  },
  async (error) => {
    const { response, config } = error;
    const isWhitelisted = whiteListReturnError.some((url) =>
      config.url?.endsWith(url)
    );

    if (response?.status === 401) {
      await router.replace({ name: 'login' });
      return Promise.reject(error);
    } else if (response?.status === 403) {
      const routeTo = router?.history?.pending?.name || '';
      if (!router || routeTo !== '/') {
        await router.replace({ path: '/' });
      }
    } else {
      if (error.message.toLowerCase() === 'network error' || !response) {
        showAlertMessage({ is_success: false, message: error.message });
      }

      if (!isWhitelisted) {
        const errorMessage =
          response?.data?.message || response?.statusText || error.message;
        showAlertMessage({ is_success: false, message: errorMessage });
      }

      if (response && isWhitelisted) {
        return {
          status: response.status,
          isSuccess: false,
          message: response.data.message,
          data: ''
        };
      }

      return response?.data || Promise.reject(error);
    }
  }
);

// Show error alert
function showAlertMessage({ is_success, message }) {
  const timeout = is_success ? 1000 : 10000;
  store.dispatch('alert-msg/showHide', {
    is_success,
    msg: message,
    is_show: true,
    timeout
  });
}

export default service;
