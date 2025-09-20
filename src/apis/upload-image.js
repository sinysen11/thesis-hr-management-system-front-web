import request from '@/services/request';
import { uploadImage } from '@/constants/apis';

// JOBS
export function createUploadImage(data) {
  return request({
    url: uploadImage.createUploadImage.url,
    method: uploadImage.createUploadImage.method,
    data
  });
}

export function getAllUploadImage() {
  return request({
    url: uploadImage.getAllUploadImage.url,
    method: uploadImage.getAllUploadImage.method
  });
}

export function getOneUploadImage(data) {
  return request({
    url: `${uploadImage.getOneUploadImage.url}/${data}`,
    method: uploadImage.getOneUploadImage.method
  });
}

export function updateUploadImage(id, data) {
  return request({
    url: `${uploadImage.updateUploadImage.url}/${id}`,
    method: uploadImage.updateUploadImage.method,
    data
  });
}

export function deleteUploadImage(id, data) {
  return request({
    url: `${uploadImage.deleteUploadImage.url}/${id}`,
    method: uploadImage.deleteUploadImage.method,
    data
  });
}

