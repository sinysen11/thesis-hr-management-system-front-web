import request from '@/services/request';
import { department } from '@/constants/apis';

export function getAllDepartment() {
  return request({
    url: department.getAllDepartment.url,
    method: department.getAllDepartment.method
  });
}
