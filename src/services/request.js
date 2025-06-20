import axios from 'axios';
import router from '@/router';
import store from '@/store';
import APIS from '@/constants/apis';
import { getToken, setToken } from '@/services/authentication'; // get token from cookie
import { refreshToken } from '@/apis/authentication';

const whiteListReturnError = [
  APIS.authentication.signin.url,
  'sys_auth/api/verify-api'
];

debugger;
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || 'http://localhost:3000/api', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 300000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  async (config) => {
    const token = (await getToken()) || '';

    config.headers.Authorization = `bearer ${token}`;
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom status
   * Here is just an example
   * You can also judge the status by HTTP Status status
   */
  async (response) => {
    return response.data;
  },
  async (error) => {
    if (error.response.status === 401) {
      /**
       * Refresh Token
       */
      const token = (await getToken()) || '';
      const refresh_token = (await getToken('refresh_token')) || '';
      const new_token_result = await refreshToken({ token, refresh_token });
      if (new_token_result) {
        await setToken('token', new_token_result.data);
        store.dispatch('authentication/verifyToken', true);
      }

      // Revoke the failed request
      error.config.headers.Authorization = `bearer ${new_token_result.data}`;
      // return with custom axios service instead of axios because we still need interceptor and other format like all other request
      return service(error.config);
    } else if (error.response.status === 403) {
      const route_to =
        router && router.history && router.history.pending
          ? router.history.pending.name
          : '';
      if (!router || route_to !== '/') {
        await router.replace({ path: '/' });
      }
    } else {
      /**
       * Show Error Alert Message
       */
      // If Network error
      if (error.message.toLowerCase() === 'network error' || !error.response) {
        showAlertMessage({ is_success: false, message: error.message });
      }
      // if url is in whiteListReturnError, return the error for individual component to handle
      if (whiteListReturnError.indexOf(error.config.url) === -1) {
        let errorMessage = '';
        if (error.response) {
          errorMessage =
            error.response && error.response.data && error.response.data.message
              ? error.response.data.message
              : error.response.statusText;
        } else {
          errorMessage = error.message;
        }
        showAlertMessage({ is_success: false, message: errorMessage });
      }
      /**
       * url in whitelist will
       * return isSuccess and error message
       */
      if (
        error.response &&
        whiteListReturnError.indexOf(error.config.url) > -1
      ) {
        const response = {
          status: error.response.status,
          isSuccess: false,
          message: error.response.data.message,
          data: ''
        };
        return response;
      }
      if (error && error.response && error.response.data) {
        return error.response.data;
      }
      return Promise.reject(error);
    }
  }
);

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
