import request from '@/services/request';
import { user } from '@/constants/apis';

// JOBS
export function createRole(data) {
  return request({
    url: user.createRole.url,
    method: user.createRole.method,
    data
  });
}

export function getAllRole() {
  return request({
    url: user.getAllRole.url,
    method: user.getAllRole.method
  });
}

export function getOneRole(data) {
  return request({
    url: `${user.getOneRole.url}/${data}`,
    method: user.getOneRole.method
  });
}

export function updateRole(id, data) {
  return request({
    url: `${user.updateRole.url}/${id}`,
    method: user.updateRole.method,
    data
  });
}

export function deleteRole(id, data) {
  return request({
    url: `${user.deleteRole.url}/${id}`,
    method: user.deleteRole.method,
    data
  });
}
export function getAllRoleTitle() {
  return request({
    url: user.getAllRoleTitle.url,
    method: user.getAllRoleTitle.method
  });
}
