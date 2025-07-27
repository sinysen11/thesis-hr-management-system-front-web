import request from '@/services/request';
import { jobs } from '@/constants/apis';

// JOBS
export function createRole(data) {
  return request({
    url: jobs.createRole.url,
    method: jobs.createRole.method,
    data
  });
}

export function getAllRole() {
  return request({
    url: jobs.getAllRole.url,
    method: jobs.getAllRole.method
  });
}

export function getOneRole(data) {
  return request({
    url: `${jobs.getOneRole.url}/${data}`,
    method: jobs.getOneRole.method
  });
}

export function updateRole(id, data) {
  return request({
    url: `${jobs.updateRole.url}/${id}`,
    method: jobs.updateRole.method,
    data
  });
}

export function deleteRole(id, data) {
  return request({
    url: `${jobs.deleteRole.url}/${id}`,
    method: jobs.deleteRole.method,
    data
  });
}
export function getAllRoleTitle() {
  return request({
    url: jobs.getAllRoleTitle.url,
    method: jobs.getAllRoleTitle.method
  });
}
