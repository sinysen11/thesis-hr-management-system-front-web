import request from '@/services/request';
import { user } from '@/constants/apis';
// USERS
export function createUser(data) {
  return request({
    url: user.createUser.url,
    method: user.createUser.method,
    data
  });
}

export function getAllUser() {
  return request({
    url: user.getAllUser.url,
    method: user.getAllUser.method
  });
}

export function getOneUser(id) {
  return request({
    url: `${user.getOneUser.url}/${id}`,
    method: user.getOneUser.method
  });
}

export function updateUser(id, data) {
  return request({
    url: `${user.updateUser.url}/${id}`,
    method: user.updateUser.method,
    data
  });
}

export function deleteUser(id) {
  return request({
    url: `${user.deleteUser.url}/${id}`,
    method: user.deleteUser.method
  });
}

export function getUserInfo(id) {
  return request({
    url: `${user.getUserInfo.url}/${id}`,
    method: user.getUserInfo.method
  });
}

export function updateUserInfo(data) {
  return request({
    url: user.updateUserInfo.url,
    method: user.updateUserInfo.method,
    data
  });
}

export function changePassword(data) {
  return request({
    url: user.changePassword.url,
    method: user.changePassword.method,
    data
  })
}
