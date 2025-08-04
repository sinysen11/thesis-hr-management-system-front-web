// src/apis/leaveRequest.js
import request from '@/services/request';
import { leaveRequest } from '@/constants/apis';

export function getAllLeaveRequest() {
  return request({
    url: leaveRequest.getAllLeaveRequest.url,
    method: leaveRequest.getAllLeaveRequest.method
  });
}

export function getOneLeaveRequest(id) {
  return request({
    url: `${leaveRequest.getOneLeaveRequest.url}/${id}`,
    method: leaveRequest.getOneLeaveRequest.method
  });
}

export function createLeaveRequest(data) {
  return request({
    url: leaveRequest.createLeaveRequest.url,
    method: leaveRequest.createLeaveRequest.method,
    data
  });
}

export function updateLeaveRequest(id, data) {
  return request({
    url: `${leaveRequest.updateLeaveRequest.url}/${id}`,
    method: leaveRequest.updateLeaveRequest.method,
    data
  });
}

export function deleteLeaveRequest(id) {
  return request({
    url: `${leaveRequest.deleteLeaveRequest.url}/${id}`,
    method: leaveRequest.deleteLeaveRequest.method
  });
}