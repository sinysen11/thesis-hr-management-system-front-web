import request from '@/services/request';
import { jobs } from '@/constants/apis';

// JOBS
export function createRequestLeave(data) {
  return request({
    url: jobs.createRequestLeave.url,
    method: jobs.createRequestLeave.method,
    data
  });
}

export function getAllRequestLeave() {
  return request({
    url: jobs.getAllRequestLeave.url,
    method: jobs.getAllRequestLeave.method
  });
}

export function getOneRequestLeave(data) {
  return request({
    url: `${jobs.getOneRequestLeave.url}/${data}`,
    method: jobs.getOneRequestLeave.method
  });
}

export function updateRequestLeave(id, data) {
  return request({
    url: `${jobs.updateRequestLeave.url}/${id}`,
    method: jobs.updateRequestLeave.method,
    data
  });
}

export function deleteRequestLeave(id, data) {
  return request({
    url: `${jobs.deleteRequestLeave.url}/${id}`,
    method: jobs.deleteRequestLeave.method,
    data
  });
}
export function getAllRequestLeave() {
  return request({
    url: jobs.getAllRequestLeave.url,
    method: jobs.getAllRequestLeave.method
  });
}
