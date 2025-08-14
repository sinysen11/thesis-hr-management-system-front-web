import request from '@/services/request';
import { jobs } from '@/constants/apis';

// JOBS
export function createJobCategory(data) {
  return request({
    url: jobs.createJobCategory.url,
    method: jobs.createJobCategory.method,
    data
  });
}

export function getAllJobCategory() {
  return request({
    url: jobs.getAllJobCategory.url,
    method: jobs.getAllJobCategory.method
  });
}

export function getOneJobCategory(data) {
  return request({
    url: `${jobs.getOneJobCategory.url}/${data}`,
    method: jobs.getOneJobCategory.method
  });
}

export function updateJobCategory(id, data) {
  return request({
    url: `${jobs.updateJobCategory.url}/${id}`,
    method: jobs.updateJobCategory.method,
    data
  });
}

export function deleteJobCategory(id, data) {
  return request({
    url: `${jobs.deleteJobCategory.url}/${id}`,
    method: jobs.deleteJobCategory.method,
    data
  });
}
export function getAllJobCategoryTitle() {
  return request({
    url: jobs.getAllJobCategoryTitle.url,
    method: jobs.getAllJobCategoryTitle.method
  });
}
