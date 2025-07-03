import request from '@/services/request';
import { employee } from '@/constants/apis';

export function getAllPosition() {
  return request({
    url: employee.getAllPosition.url,
    method: employee.getAllPosition.method
  });
}
