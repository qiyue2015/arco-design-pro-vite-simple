import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export function getUserInfo() {
  return axios.get<UserState>('/v1/user/profile');
}

// 修改基本资料
export function updateUserinfo(data: any) {
  return axios.put<UserState>('/v1/user/profile', data);
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/v1/auth/menu');
}

// 上传头像
export function uploadAvatar(data: FormData) {
  return axios.post('/v1/user/upload-avatar', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
