import request from '@/services/request';
import { position } from '@/constants/apis';

export function getAllPosition() {
  return request({
    url: position.getAllPosition.url,
    method: position.getAllPosition.method
  });
}

export function createPostion(data) {
  return request({
    url: position.createPostion.url,
    method: position.createPostion.method,
    data
  });
}

export function getOnePosition(data) {
  return request({
    url: `${position.getOnePosition.url}/${data}`,
    method: position.getOnePosition.method
  });
}

export function updatePosition(id, data) {
  return request({
    url: `${position.updatePosition.url}/${id}`,
    method: position.updatePosition.method,
    data
  });
}

export function deletePosition(id, data) {
  return request({
    url: `${position.deletePosition.url}/${id}`,
    method: position.deletePosition.method,
    data
  });
}
