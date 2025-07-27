import request from '@/services/request';
import { jobs } from '@/constants/apis';

// JOBS
export function createJobTitle(data) {
  return request({
    url: jobs.createJobTitle.url,
    method: jobs.createJobTitle.method,
    data
  });
}

export function getAllJobTitle() {
  return request({
    url: jobs.getAllJobTitle.url,
    method: jobs.getAllJobTitle.method
  });
}

export function getOneJobTitle(data) {
  return request({
    url: `${jobs.getOneJobTitle.url}/${data}`,
    method: jobs.getOneJobTitle.method
  });
}

export function updateJobTitle(id, data) {
  return request({
    url: `${jobs.updateJobTitle.url}/${id}`,
    method: jobs.updateJobTitle.method,
    data
  });
}

export function deleteJobTitle(id, data) {
  return request({
    url: `${jobs.deleteJobTitle.url}/${id}`,
    method: jobs.deleteJobTitle.method,
    data
  });
}
export function getAllJobTitleTitle() {
  return request({
    url: jobs.getAllJobTitleTitle.url,
    method: jobs.getAllJobTitleTitle.method
  });
}
