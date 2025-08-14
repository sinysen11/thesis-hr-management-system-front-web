// src/apis/department.js
import request from '@/services/request';
import { department } from '@/constants/apis';

export function getAllDepartment() {
  return request({
    url: department.getAllDepartment.url,
    method: department.getAllDepartment.method
  });
}

export function getOneDepartment(id) {
  return request({
    url: `${department.getOneDepartment.url}/${id}`,
    method: department.getOneDepartment.method
  });
}

export function createDepartment(data) {
  return request({
    url: department.createDepartment.url,
    method: department.createDepartment.method,
    data
  });
}

export function updateDepartment(id, data) {
  return request({
    url: `${department.updateDepartment.url}/${id}`,
    method: department.updateDepartment.method,
    data
  });
}

export function deleteDepartment(id) {
  return request({
    url: `${department.deleteDepartment.url}/${id}`,
    method: department.deleteDepartment.method
  });
}