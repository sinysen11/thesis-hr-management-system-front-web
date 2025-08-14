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

// JOB TITLES
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
export function createJobTitle(data) {
  return request({
    url: jobs.createJobTitle.url,
    method: jobs.createJobTitle.method,
    data
  });
}

export function updateJobTitle(id, data) {
  return request({
    url: `${jobs.updateJobTitle.url}/${id}`,
    method: jobs.updateJobTitle.method,
    data
  });
}

export function deleteJobTitle(id) {
  return request({
    url: `${jobs.deleteJobTitle.url}/${id}`,
    method: jobs.deleteJobTitle.method
  });
}