import axios from 'axios';

export interface StoreOrderRecord {
  id: number;
  store_id: number;
  merchant_id: string;
  member_id: number;
  order_no: string;
  out_store_id: string;
  store_trade_no: string;
  store_goods: any;
  merchant_trade_no: any;
  amount: string;
  status: number;
  refund_status?: number;
  pay_time: string;
  created_at: string;
  updated_at: string;
  store: {
    id: number;
    name: string;
  };
}

// POST /v1/store/login
export function storeLogin(data: any) {
  return axios.post('/v1/store/login', data);
}

// POST /v1/store/logout
export function storeLogout() {
  return axios.post('/v1/store/logout');
}

// POST /v1/store/pay/scan
export function storePayScan(data: any) {
  return axios.post('/v1/store/pay/scan', data);
}

// POST /v1/store/member
export function storeMember(data: any) {
  return axios.post('/v1/store/member', data);
}

// GET /v1/store/orders?order_no
export function storeOrders(params: any) {
  return axios.get('/v1/store/orders', { params });
}

// POST /v1/store/orders/{order_no}/refund
export function storeOrderRefund(orderNo: string, data: { refund_amount: string; reason: string }) {
  return axios.post(`/v1/store/orders/${orderNo}/refund`, data);
}
