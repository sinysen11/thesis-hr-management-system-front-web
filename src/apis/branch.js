import request from '@/services/request';
import { branches } from '@/constants/apis';

export function getAllBranch(data) {
  return request({
    url: branches.getAllBranch.url,
    method: branches.getAllBranch.method,
    data
  });
}

export function createBranch(data) {
  return request({
    url: branches.createBranch.url,
    method: branches.createBranch.method,
    data
  });
}
export function getOneBranch(data) {
  return request({
    url: `${branches.getOneBranch.url}/${data}`,
    method: branches.getOneBranch.method
  });
}

export function updateBranch(id, data) {
  return request({
    url: `${branches.updateBranch.url}/${id}`,
    method: branches.updateBranch.method,
    data
  });
}

export function deleteBranch(id, data) {
  return request({
    url: `${branches.deleteBranch.url}/${id}`,
    method: branches.deleteBranch.method,
    data
  });
}
