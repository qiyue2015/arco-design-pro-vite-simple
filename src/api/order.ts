import { AnyObject } from '@/types/global';
import axios from 'axios';
import qs from 'query-string';

export interface OrderRecord {
  id: number;
  title: string;
  description: string;
  thumb: string;
}

export interface OrderParams extends Partial<OrderRecord> {
  current: number;
  pageSize: number;
}

export interface OrderListRes {
  list: OrderRecord[];
  total: number;
}

// 例表
export function queryOrderList(params: OrderParams) {
  return axios.get<OrderListRes>('/v1/store/orders', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 增加
export function postOrder(data: AnyObject) {
  return axios.post('/api/orders', data);
}

// 删除
export function deleteOrder(id: number) {
  return axios.delete(`/api/orders/${id}`);
}

// 修改
export function putOrder(id: number, data: AnyObject) {
  return axios.put(`/api/orders/${id}`, data);
}

// 详情
export function getOrderDetail(id: number) {
  return axios.get(`/api/orders/${id}`, {
    params: { id },
  });
}
