import request from '@/services/request';
import { publicHoliday } from '@/constants/apis';

export function getAllPublicHoliday() {
  return request({
    url: publicHoliday.getAllPublicHoliday.url,
    method: publicHoliday.getAllPublicHoliday.method
  });
}

export function createPublicHoliday(data) {
  return request({
    url: publicHoliday.createPublicHoliday.url,
    method: publicHoliday.createPublicHoliday.method,
    data
  });
}

export function updatePublicHoliday(id, data) {
  return request({
    url: `${publicHoliday.updatePublicHoliday.url}/${id}`,
    method: publicHoliday.updatePublicHoliday.method,
    data
  });
}

export function deletePublicHoliday(id, data) {
  return request({
    url: `${publicHoliday.deletePublicHoliday.url}/${id}`,
    method: publicHoliday.deletePublicHoliday.method,
    data
  });
}

export function getHolidayDate() {
  return request({
    url: publicHoliday.getHolidayDate.url,
    method: publicHoliday.getHolidayDate.method
  })
}