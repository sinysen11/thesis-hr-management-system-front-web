import request from '@/services/request';
import { branches } from '@/constants/apis';

export function getAllApplicant(data) {
  return request({
    url: branches.getAllApplicant.url,
    method: branches.getAllApplicant.method,
    data
  });
}

export function createApplicant(data) {
  return request({
    url: branches.createApplicant.url,
    method: branches.createApplicant.method,
    data
  });
}
export function getOneApplicant(data) {
  return request({
    url: `${branches.getOneApplicant.url}/${data}`,
    method: branches.getOneApplicant.method
  });
}

export function updateApplicant(id, data) {
  return request({
    url: `${branches.updateApplicant.url}/${id}`,
    method: branches.updateApplicant.method,
    data
  });
}

export function deleteApplicant(id, data) {
  return request({
    url: `${branches.deleteApplicant.url}/${id}`,
    method: branches.deleteApplicant.method,
    data
  });
}
