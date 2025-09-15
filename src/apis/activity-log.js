import request from '@/services/request';
import { activityLog } from '@/constants/apis';

export function getAllActivityLog() {
  return request({
    url: activityLog.getAllActivityLog.url,
    method: activityLog.getAllActivityLog.method
  });
}

export function getOneActivityLog(data) {
  return request({
    url: `${activityLog.getOneActivityLog.url}/${data}`,
    method: activityLog.getOneActivityLog.method
  });
}

