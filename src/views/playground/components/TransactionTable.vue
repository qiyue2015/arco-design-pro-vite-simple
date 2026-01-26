<template>
  <div class="h-full">
    <Grid class="h-full">
      <!-- Refresh Button -->
      <template #title>
        <div class="flex items-center justify-between">
          <div>交易记录</div>
          <a-tooltip content="刷新">
            <icon-sync :spin="listLoading" class="cursor-pointer" @click="fetchOrderList" />
          </a-tooltip>
        </div>
      </template>

      <GridTable
        :loading="listLoading"
        :data="orderList"
        :columns="columns"
        :pagination="pagination"
        :scroll="scroll"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #order_no="{ record }">
          <a-link @click="openDetailDrawer(record)">{{ record.order_no }}</a-link>
        </template>

        <template #amount="{ record }"> ¥ {{ record.amount }} </template>

        <template #status="{ record }">
          <a-tag :color="getOrderStatusColor(record.status)" size="small">
            {{ getOrderStatusText(record.status) }}
          </a-tag>
        </template>

        <template #operations="{ record }">
          <a-link v-if="record.status !== 4" type="text" size="small" @click="openRefundModal(record)"> 退款 </a-link>
        </template>
      </GridTable>
    </Grid>

    <!-- Refund Modal -->
    <a-modal v-model:visible="refundModalVisible" title="退款接口调试器" simple @ok="handleRefundSubmit">
      <a-form :model="refundForm" layout="vertical">
        <a-form-item field="refund_amount" label="退款金额 (refund_amount)">
          <a-input v-model="refundForm.refund_amount" placeholder="退款金额" />
        </a-form-item>
        <a-form-item field="reason" label="退款原因 (reason)">
          <a-input v-model="refundForm.reason" placeholder="退款原因" />
        </a-form-item>
      </a-form>
    </a-modal>

    <OrderDetailDrawer ref="detailDrawerRef" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, reactive, onMounted, onUnmounted } from 'vue';
  import { Message, TableColumnData, PaginationProps } from '@arco-design/web-vue';
  import { storeOrders, storeOrderRefund } from '@/api/playground';
  import Grid from '@/components/grid/index.vue';
  import GridTable from '@/components/grid/grid-table.vue';
  import type { StoreOrderRecord } from '@/api/playground';
  import OrderDetailDrawer from '@/views/order/components/OrderDetailDrawer.vue';

  const ORDER_STATUS_MAP: Record<number, string> = {
    0: '待支付',
    1: '已支付',
    2: '已取消',
    3: '退款中',
    4: '已退款',
    5: '部分退款',
    6: '支付失败',
  };

  const listLoading = ref(false);
  const pagination = reactive<PaginationProps>({
    current: 1,
    pageSize: 20,
    total: 0,
    showTotal: true,
    showPageSize: true,
    pageSizeOptions: [10, 20, 50, 100],
  });
  const orderList = ref<StoreOrderRecord[]>([]);
  const scroll = ref({ y: 500 });
  const setTableHeight = () => {
    const height = window.innerHeight - 290;
    scroll.value.y = height > 200 ? height : 200;
  };

  const columns: TableColumnData[] = [
    { title: '门店', dataIndex: 'store.name', width: 100 },
    { title: '门店号', dataIndex: 'store.out_store_id', width: 100 },
    { title: '订单号', slotName: 'order_no', width: 240 },
    { title: '金额', slotName: 'amount', width: 100 },
    { title: '状态', slotName: 'status', width: 100 },
    { title: '创建时间', dataIndex: 'created_at', width: 180 },
    { title: '付款时间', dataIndex: 'pay_time', width: 180 },
    { title: '操作', slotName: 'operations', width: 130, fixed: 'right' },
  ];

  const refundModalVisible = ref(false);
  const currentRefundOrderNo = ref('');
  const refundForm = reactive({
    refund_amount: '',
    reason: '',
  });

  const detailDrawerRef = ref();

  const getOrderStatusText = (status: number) => ORDER_STATUS_MAP[status] || 'Unknown';

  const getOrderStatusColor = (status: number) => {
    const map: Record<number, string> = {
      0: 'orange', // Pending
      1: 'green', // Paid
      2: 'gray', // Cancelled
      3: 'blue', // Refunding
      4: 'purple', // Refunded
      5: 'cyan', // Partially Refunded
      6: 'red', // Failed
    };
    return map[status] || 'gray';
  };

  const fetchOrderList = async () => {
    listLoading.value = true;
    try {
      const { data } = await storeOrders({
        page: pagination.current,
        pageSize: pagination.pageSize,
      });
      if (data && Array.isArray(data.data)) {
        orderList.value = data.data;
        pagination.total = data.meta?.total || data.total || 0;
      } else if (Array.isArray(data)) {
        orderList.value = data;
        pagination.total = data.length;
      } else {
        orderList.value = [];
        pagination.total = 0;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Fetch orders failed', e);
    } finally {
      listLoading.value = false;
    }
  };

  const onPageChange = (current: number) => {
    pagination.current = current;
    fetchOrderList();
  };

  const onPageSizeChange = (pageSize: number) => {
    pagination.current = 1;
    pagination.pageSize = pageSize;
    fetchOrderList();
  };

  const openRefundModal = (item: StoreOrderRecord) => {
    currentRefundOrderNo.value = item.store_trade_no;
    refundForm.refund_amount = item.amount;
    refundForm.reason = 'Playground 测试退款';
    refundModalVisible.value = true;
  };

  const openDetailDrawer = (item: StoreOrderRecord) => {
    detailDrawerRef.value?.onDetail(item);
  };

  const handleRefundSubmit = async () => {
    if (!currentRefundOrderNo.value) return false;

    try {
      const res = (await storeOrderRefund(currentRefundOrderNo.value, {
        refund_amount: refundForm.refund_amount,
        reason: refundForm.reason,
      })) as any;

      if (res.success) {
        const refundNo = res.data?.merchant_refund_no;
        Message.success(`退款已发起${refundNo ? ` (单号: ${refundNo})` : ''}`);
        fetchOrderList();
        refundModalVisible.value = false;
        return true;
      }
      return false;
    } catch (e: any) {
      return false;
    }
  };

  defineEmits(['refresh']);

  const refresh = () => {
    fetchOrderList();
  };

  onMounted(() => {
    fetchOrderList();
    setTableHeight();
    window.addEventListener('resize', setTableHeight);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', setTableHeight);
  });

  defineExpose({ refresh });
</script>
