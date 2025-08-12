import axios from 'axios';

// 发送验证码
export function sendPhoneCode(phone: string) {
  return axios.post('/api/sms-code/send', { phone });
}

// 发送邮件验证码
export function sendEmailCode(email: string) {
  return axios.post('/api/sms-code/send', { email });
}
