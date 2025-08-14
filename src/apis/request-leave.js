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

export function getOwnerLeaveRequest(user_id) {
  return request({
    url: `${leaveRequest.getOwnerLeaveRequest.url}/${user_id}`,
    method: `${leaveRequest.getOwnerLeaveRequest.method}`
  })
}

export function getLeavebalanceForUser(user_id) {
  return request({
    url: `${leaveRequest.getLeaveBalanceForUser.url}/${user_id}`,
    method: `${leaveRequest.getLeaveBalanceForUser.method}`
  })
}

export function getAllApprover() {
  return request({
    url: `${leaveRequest.getAllApprover.url}`,
    method: `${leaveRequest.getAllApprover.method}`
  })
}

export function getLeaveType() {
  return request({
    url: `${leaveRequest.getLeaveType.url}`,
    method: `${leaveRequest.getLeaveType.method}`
  })
}

export function createLeaveRequest(data) {
  return request({
    url: `${leaveRequest.createLeaveRequest.url}`,
    method: `${leaveRequest.createLeaveRequest.method}`,
    data
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