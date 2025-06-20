import request from '@/services/request';
import { authentication } from '@/constants/apis';

export function categoirs(data) {
  return request({
    url: categoirs.url,
    method: categoirs.method,
    data
  });
}

export function signin(data) {
  return request({
    url: authentication.signin.url,
    method: authentication.signin.method,
    data
  });
}

export function verifyToken(data) {
  return request({
    url: authentication.verifyToken.url,
    method: authentication.verifyToken.method,
    data
  });
}

export function refreshToken(data) {
  return request({
    url: authentication.refreshToken.url,
    method: authentication.refreshToken.method,
    data
  });
}

export function verifyWebpage(data) {
  return request({
    url: authentication.verifyWebpage.url,
    method: authentication.verifyWebpage.method,
    data: {
      name: data
    }
  });
}

export function getAllUserRole() {
  return request({
    url: authentication.getAllUserRole.url,
    method: authentication.getAllUserRole.method
  });
}

export function getOneCreditUserRole() {
  return request({
    url: authentication.getOneCreditUserRole.url,
    method: authentication.getOneCreditUserRole.method
  });
}

export function getMenuByRole() {
  return request({
    url: authentication.getMenuByRole.url,
    method: authentication.getMenuByRole.method
  });
}
