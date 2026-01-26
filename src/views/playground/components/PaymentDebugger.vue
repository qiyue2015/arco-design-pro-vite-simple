<template>
  <a-card title="支付接口调试器" class="general-card h-full">
    <a-form :model="paymentForm" layout="vertical" @submit="handlePaymentSubmit">
      <a-form-item field="amount" label="订单金额 (amount)">
        <a-input v-model="paymentForm.amount" placeholder="支付总金额，例如 1.00" />
      </a-form-item>
      <a-form-item field="auth_code" label="付款码 (auth_code)">
        <a-textarea v-model="paymentForm.auth_code" placeholder="用户付款码（扫描结果）" />
      </a-form-item>
      <a-form-item field="out_store_id" label="门店号 (out_store_id)">
        <a-select v-model="paymentForm.out_store_id" placeholder="选择门店" :loading="storeLoading" allow-search>
          <a-option v-for="item in storeList" :key="item.id" :value="item.out_store_id">
            {{ item.name }} ({{ item.out_store_id }})
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item field="store_trade_no" label="交易单号 (store_trade_no)">
        <a-input v-model="paymentForm.store_trade_no">
          <template #append>
            <a-button @click="refreshTradeNo">
              <template #icon><icon-refresh /></template>
            </a-button>
          </template>
        </a-input>
      </a-form-item>
      <a-form-item field="store_goods" label="商品详情 (store_goods)">
        <a-textarea
          v-model="paymentForm.store_goods"
          :auto-size="{ minRows: 2, maxRows: 3 }"
          placeholder='JSON Array, e.g. [{"goods_id":"123","goods_name":"Product","price":10,"quantity":1}]'
        />
        <template #extra>JSON 格式商品列表。仅用于生成订单快照，不参与金额逻辑校验。</template>
      </a-form-item>
      <a-form-item hide-label>
        <a-button type="primary" html-type="submit" long :loading="paymentLoading"> 发送支付请求 </a-button>
      </a-form-item>
      <a-divider />
      <div class="text-center">
        <a-space direction="vertical">
          <a-link href="https://test.qyyp.xinleshan.cn/pages/users/user_zsy_code/index" target="_blank"> CRMEB 付款码 </a-link>
          <a-link href="https://qihutong-test.magcloud.net/h5/index.html#/pages/home/pay-code" target="_blank">
            嘉选付款码
          </a-link>
        </a-space>
      </div>
    </a-form>
  </a-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, onMounted } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { storePayScan, storeMember } from '@/api/playground';
  import { queryShopList, ShopRecord } from '@/api/shop';

  const emit = defineEmits(['success']);

  const paymentLoading = ref(false);
  const storeLoading = ref(false);
  const storeList = ref<ShopRecord[]>([]);

  const paymentForm = reactive({
    amount: '1',
    auth_code: '',
    out_store_id: '',
    store_trade_no: '',
    store_goods: JSON.stringify([
      { goods_id: '6937962199173', goods_name: '金龙鱼稻花香5kg(5kg)', price: 49.9, quantity: 24.0 },
      { goods_id: '6948195805120', goods_name: '金龙鱼特香低芥酸菜籽油5L(5L)', price: 59.9, quantity: 24.0 },
    ]),
  });

  const generateTradeNo = (): string => {
    const now = new Date();
    const timestamp =
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    return `${timestamp}${random}`;
  };
  // #endregion

  // #region Methods
  const refreshTradeNo = () => {
    paymentForm.store_trade_no = generateTradeNo();
  };

  const fetchStoreList = async () => {
    try {
      storeLoading.value = true;
      const res = await queryShopList({ current: 1, pageSize: 100 });
      // 根据 api/shop.ts 里的定义，queryShopList 返回 ShopListRes，但 interceptor 可能会解包。
      // 假设 interceptor 返回 { code: 0, data: { data: [], meta: ... } }，
      // 那么这里的 res 是 { data: ShopRecord[], meta: any }
      // 如果 interceptor 只是返回 res.data (HttpResponse)，那么 res.data 是 T (ShopListRes)。
      // 实际上 axios 定义是 axios.get<any, ShopListRes>.
      // 如果 interceptor 返回 res (response.data)，则 res 是 HttpResponse<ShopListRes>
      // 那么我们需要 res.data.data
      // 先打印看看或者做个防御性检查
      const list = (res as any).data?.data || (res as any).data || [];
      storeList.value = list;

      if (list.length > 0 && !paymentForm.out_store_id) {
        // 默认选中第一个
        paymentForm.out_store_id = list[0].out_store_id;
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      storeLoading.value = false;
    }
  };

  const handlePaymentSubmit = async () => {
    paymentLoading.value = true;

    // 1. Check Member
    try {
      const memberRes = (await storeMember({ auth_code: paymentForm.auth_code })) as any;
      const memberData = memberRes.data;
      const balance = Number(memberData.balance);
      const payAmount = Number(paymentForm.amount);

      if (Number.isNaN(balance)) {
        Message.error('无法获取会员余额');
        paymentLoading.value = false;
        return;
      }

      if (balance < payAmount) {
        Message.error(`余额不足。余额：${balance}，需要：${payAmount}`);
        paymentLoading.value = false;
        return;
      }
    } catch (e: any) {
      paymentLoading.value = false;
      return;
    }

    try {
      // 2. Process Payment
      const payRes = (await storePayScan({
        amount: paymentForm.amount,
        auth_code: paymentForm.auth_code,
        out_store_id: paymentForm.out_store_id,
        store_trade_no: paymentForm.store_trade_no,
        store_goods: paymentForm.store_goods,
      })) as any;

      if (payRes.success && payRes.data?.order_no) {
        Message.success('支付成功');
        refreshTradeNo();
        emit('success');
      } else {
        Message.error(payRes.message || '支付失败');
      }
    } finally {
      paymentLoading.value = false;
    }
  };

  onMounted(() => {
    refreshTradeNo();
    fetchStoreList();
  });
</script>
