import axios from 'axios';

export interface AccountLoginData {
  username: string;
  password: string;
}

export interface MobileLoginData {
  mobile: string;
  code: string;
}

export interface EmailLoginData {
  email: string;
  code: string;
}

export interface LoginRes {
  token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterData {
  mobile: string;
  code: string;
  name?: string;
  password?: string;
  invite_code?: string;
}

export function register(data: RegisterData) {
  return axios.post('/api/auth/register', data);
}

export function loginByAccount(data: AccountLoginData) {
  return axios.post<LoginRes>('/api/auth/login/account', data);
}

export function loginByMobile(data: MobileLoginData) {
  return axios.post<LoginRes>('/api/auth/login/mobile', data);
}

export function loginByEmail(data: EmailLoginData) {
  return axios.post<LoginRes>('/api/auth/login/email', data);
}

export function logout() {
  return axios.post<LoginRes>('/api/auth/logout');
}

export function setPassword(data: { name: string; password: string; password_confirmation: string }) {
  return axios.post('/api/auth/set-password', data);
}

export function changePassword(data: { current_password: string; password: string; password_confirmation: string }) {
  return axios.post('/api/auth/change-password', data);
}

export function bindMobile(data: { mobile: string; code: string }) {
  return axios.post('/api/auth/bind/mobile', data);
}
