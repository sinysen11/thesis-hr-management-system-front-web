import request from '@/services/request';
import { users } from '@/constants/apis';
import axios from 'axios';

export const verifyToken = async (token) => {
  const response = await axios.post(
    'http://localhost:3000/api/users/verify-token',
    { token: token },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return response.data;
};

export function signin(data) {
  return request({
    url: users.signin.url, // Maps to 'users/login'
    method: users.signin.method,
    data
  });
}

export function refreshToken(data) {
  return request({
    url: users.refreshToken.url,
    method: users.refreshToken.method,
    data
  });
}

export function verifyWebpage(data) {
  return request({
    url: users.verifyWebpage.url,
    method: users.verifyWebpage.method,
    data: {
      name: data
    }
  });
}

export function getAllUserRole() {
  return request({
    url: users.getAllUserRole.url,
    method: users.getAllUserRole.method
  });
}

export function getOneCreditUserRole() {
  return request({
    url: users.getOneCreditUserRole.url,
    method: users.getOneCreditUserRole.method
  });
}

export function getMenuByRole() {
  return request({
    url: users.getMenuByRole.url,
    method: users.getMenuByRole.method
  });
}
