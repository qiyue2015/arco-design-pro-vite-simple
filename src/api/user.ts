import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export function getUserInfo() {
  return axios.get<UserState>('/api/user/profile');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/auth/menu');
}

// 上传头像
export function uploadAvatar(data: FormData) {
  return axios.post('/api/user/upload-avatar', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
