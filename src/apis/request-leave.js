// src/apis/leaveRequest.js
import request from '@/services/request';
import { leaveRequest } from '@/constants/apis';

export function getAllLeaveRequestForAdmin(id) {
  return request({
    url: `${leaveRequest.getAllLeaveRequestForAdmin.url}/${id}`,
    method: leaveRequest.getAllLeaveRequestForAdmin.method
  });
}

export function getStaffRequestForApprover(id) {
  return request({
    url: `${leaveRequest.getStaffRequestForApprover.url}/${id}`,
    method: leaveRequest.getStaffRequestForApprover.method
  });
}

export function allowStaffRequestLeave(request_id, status) {
  return request({
    url: `${leaveRequest.allowStaffRequestLeave.url}/${request_id}`,
    method: `${leaveRequest.allowStaffRequestLeave.method}`,
    data: {
      status
    }
  })
}

export function createLeaveRequestForAdmin(data) {
  return request({
    url: leaveRequest.createLeaveRequestForAdmin.url,
    method: leaveRequest.createLeaveRequestForAdmin.method,
    data
  });
}

export function updateLeaveRequestForAdmin(id, data) {
  return request({
    url: `${leaveRequest.updateLeaveRequestForAdmin.url}/${id}`,
    method: leaveRequest.updateLeaveRequestForAdmin.method,
    data
  });
}

export function deleteLeaveRequestForAdmin(id) {
  return request({
    url: `${leaveRequest.deleteLeaveRequestForAdmin.url}/${id}`,
    method: leaveRequest.deleteLeaveRequestForAdmin.method
  });
}

// For staff
export function getAllLeaveRequestForStaff(id) {
  return request({
    url: `${leaveRequest.getAllLeaveRequestForStaff.url}/${id}`,
    method: leaveRequest.getAllLeaveRequestForStaff.method
  });
}

export function getOneLeaveRequestForStaff(id) {
  return request({
    url: `${leaveRequest.getOneLeaveRequestForStaff.url}/${id}`,
    method: leaveRequest.getOneLeaveRequestForStaff.method
  });
}

export function createLeaveRequestForStaff(data) {
  return request({
    url: leaveRequest.createLeaveRequestForStaff.url,
    method: leaveRequest.createLeaveRequestForStaff.method,
    data
  });
}

export function updateLeaveRequestForStaff(id, data) {
  return request({
    url: `${leaveRequest.updateLeaveRequestForStaff.url}/${id}`,
    method: leaveRequest.updateLeaveRequestForStaff.method,
    data
  });
}

export function deleteLeaveRequestForStaff(id) {
  return request({
    url: `${leaveRequest.deleteLeaveRequestForStaff.url}/${id}`,
    method: leaveRequest.deleteLeaveRequestForStaff.method
  });
}