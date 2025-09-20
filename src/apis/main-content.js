import request from '@/services/request';
import { mainContent } from '@/constants/apis';

// JOBS
export function createMainContent(data) {
  return request({
    url: mainContent.createMainContent.url,
    method: mainContent.createMainContent.method,
    data
  });
}

export function getAllMainContent() {
  return request({
    url: mainContent.getAllMainContent.url,
    method: mainContent.getAllMainContent.method
  });
}

export function getOneMainContent(data) {
  return request({
    url: `${mainContent.getOneMainContent.url}/${data}`,
    method: mainContent.getOneMainContent.method
  });
}

export function updateMainContent(id, data) {
  return request({
    url: `${mainContent.updateMainContent.url}/${id}`,
    method: mainContent.updateMainContent.method,
    data
  });
}

export function deleteMainContent(id, data) {
  return request({
    url: `${mainContent.deleteMainContent.url}/${id}`,
    method: mainContent.deleteMainContent.method,
    data
  });
}

