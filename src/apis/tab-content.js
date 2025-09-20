import request from '@/services/request';
import { tabContent } from '@/constants/apis';

// JOBS
export function createTabContent(data) {
  return request({
    url: tabContent.createTabContent.url,
    method: tabContent.createTabContent.method,
    data
  });
}

export function getAllTabContent() {
  return request({
    url: tabContent.getAllTabContent.url,
    method: tabContent.getAllTabContent.method
  });
}

export function getOneTabContent(data) {
  return request({
    url: `${tabContent.getOneTabContent.url}/${data}`,
    method: tabContent.getOneTabContent.method
  });
}

export function updateTabContent(id, data) {
  return request({
    url: `${tabContent.updateTabContent.url}/${id}`,
    method: tabContent.updateTabContent.method,
    data
  });
}

export function deleteTabContent(id, data) {
  return request({
    url: `${tabContent.deleteTabContent.url}/${id}`,
    method: tabContent.deleteTabContent.method,
    data
  });
}

