import axios from 'axios';
import qs from 'query-string';

export interface OrderRecord {
  id: number;
  merchant_id: string;
  store_id: number;
  order_no: string;
  store_trade_no: string;
  merchant_trade_no: string;
  amount: string;
  status: number;
  pay_time: string;
  store_goods: {
    price: number;
    goods_id: string;
    quantity: number;
    goods_name: string;
  }[];
  created_at: string;
  updated_at: string;
  store: {
    id: number;
    name: string;
    out_store_id: string;
  };
}

export interface OrderParams extends Partial<OrderRecord> {
  current: number;
  pageSize: number;
}

export interface OrderListRes {
  data: OrderRecord[];
  meta: any;
}

// 例表
export function queryOrderList(params: OrderParams) {
  return axios.get<any, OrderListRes>('/store/admin/orders', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 退款例表
export function queryOrderRefundList(params: OrderParams) {
  return axios.get<any, OrderListRes>('/store/admin/orders/refunds', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
