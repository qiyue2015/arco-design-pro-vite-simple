import { AnyObject } from '@/types/global';
import axios from 'axios';
import qs from 'query-string';

export interface ShopRecord {
  id: number;
  ability_id: number;
  out_store_id: string;
  name: string;
  address: string;
  contact_name: string;
  contact_phone: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

export interface ShopParams extends Partial<ShopRecord> {
  current: number;
  pageSize: number;
}

export interface ShopListRes {
  data: ShopRecord[];
  meta: any;
}

// 例表
export function queryShopList(params: ShopParams) {
  return axios.get<any, ShopListRes>('/v1/store/shops', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 增加
export function postShop(data: AnyObject) {
  return axios.post('/api/shops', data);
}

// 删除
export function deleteShop(id: number) {
  return axios.delete(`/api/shops/${id}`);
}

// 修改
export function putShop(id: number, data: AnyObject) {
  return axios.put(`/api/shops/${id}`, data);
}

// 详情
export function getShopDetail(id: number) {
  return axios.get(`/api/shops/${id}`, {
    params: { id },
  });
}
