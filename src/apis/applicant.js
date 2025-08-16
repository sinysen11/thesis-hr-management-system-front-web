import request from '@/services/request';
import { applicant } from '@/constants/apis';

export function getAllApplicant(data) {
  return request({
    url: applicant.getAllApplicant.url,
    method: applicant.getAllApplicant.method,
    data
  });
}
export function getOneResume(id) {
  return request({
    url: `${applicant.getOneResume.url}/${id}/document`,
    method: applicant.getOneResume.method,
    responseType: 'blob' // tells Axios to return binary data
  });
}

export function createApplicant(data) {
  return request({
    url: applicant.createApplicant.url,
    method: applicant.createApplicant.method,
    data
  });
}
export function getOneApplicant(data) {
  return request({
    url: `${applicant.getOneApplicant.url}/${data}`,
    method: applicant.getOneApplicant.method
  });
}

export function updateApplicant(id, data) {
  return request({
    url: `${applicant.updateApplicant.url}/${id}`,
    method: applicant.updateApplicant.method,
    data
  });
}

export function deleteApplicant(id, data) {
  return request({
    url: `${applicant.deleteApplicant.url}/${id}`,
    method: applicant.deleteApplicant.method,
    data
  });
}
