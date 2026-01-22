import axios from 'axios';
import type { RouteRecordNormalized } from 'vue-router';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
}

export interface LoginRes {
  access_token: string;
}

export function login(data: LoginData) {
  return axios.post<LoginRes>('/v1/store/login', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getUserInfo() {
  return axios.post<UserState>('/api/user/info');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

export interface RegisterData {
  phone: string;
  code: string;
  password: string;
  invite_code?: string;
}

export function register(data: RegisterData) {
  return axios.post('/api/user/register', data);
}

// 上传头像
export function uploadAvatar(data: FormData) {
  return axios.post('/api/user/upload-avatar', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}
