import request from '@/services/request';
import { jobs } from '@/constants/apis';

// JOBS
export function createJob(data) {
  return request({
    url: jobs.createJob.url,
    method: jobs.createJob.method,
    data
  });
}

export function getAllJob() {
  return request({
    url: jobs.getAllJob.url,
    method: jobs.getAllJob.method
  });
}

export function getOneJob(data) {
  return request({
    url: `${jobs.getOneJob.url}/${data}`,
    method: jobs.getOneJob.method
  });
}

export function updateJob(id, data) {
  return request({
    url: `${jobs.updateJob.url}/${id}`,
    method: jobs.updateJob.method,
    data
  });
}

export function deleteJob(id, data) {
  return request({
    url: `${jobs.deleteJob.url}/${id}`,
    method: jobs.deleteJob.method,
    data
  });
}
export function getAllJobTitle() {
  return request({
    url: jobs.getAllJobTitle.url,
    method: jobs.getAllJobTitle.method
  });
}
