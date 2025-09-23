import axios from 'axios';

// 发送验证码
export function sendMobileCode(mobile: string) {
  return axios.post('/api/verify-code', { mobile });
}

// 发送邮件验证码
export function sendEmailCode(email: string) {
  return axios.post('/api/verify-code', { email });
}
