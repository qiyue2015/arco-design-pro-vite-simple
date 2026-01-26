<template>
  <div class="page-container">
    <Grid>
      <template #title>
        <div class="flex items-center justify-between">
          <div>退款订单</div>
          <a-tooltip content="刷新">
            <icon-sync :spin="loading" class="cursor-pointer" @click="onRefresh" />
          </a-tooltip>
        </div>
      </template>
      <!-- 表格 -->
      <GridTable
        :loading="loading"
        :data="renderData"
        :columns="tableColumns"
        :pagination="pagination"
        @page-change="onPageChange"
        @page-size-change="onPageSizeChange"
      >
        <template #amount="{ record }"> {{ record.amount }} 元 </template>
        <template #status="{ record }">
          <a-tag v-if="record.status === 0" color="blue">申请中</a-tag>
          <a-tag v-else-if="record.status === 1" color="orange">处理中</a-tag>
          <a-tag v-else-if="record.status === 2" color="green">退款成功</a-tag>
          <a-tag v-else-if="record.status === 3" color="red">退款失败</a-tag>
          <a-tag v-else-if="record.status === 4" color="gray">已拒绝</a-tag>
          <a-tag v-else color="gray">未知状态 ({{ record.status }})</a-tag>
        </template>
      </GridTable>
    </Grid>

    <OrderDetailDrawer ref="OrderDetailDrawerRef" />
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, reactive } from 'vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { PaginationProps } from '@arco-design/web-vue';
  import { useLoading } from '@/hooks';
  import { OrderParams, OrderRecord, queryOrderRefundList } from '@/api/order';
  import OrderDetailDrawer from './components/OrderDetailDrawer.vue';

  const tableColumns = computed<TableColumnData[]>(() => [
    { title: '创建时间', dataIndex: 'created_at', width: 180 },
    { title: '退款单号', dataIndex: 'refund_no', width: 260 },
    { title: '门店订单号', dataIndex: 'order.store_trade_no', width: 280 },
    { title: '退款金额', slotName: 'amount', width: 120 },
    { title: '状态', slotName: 'status', width: 100 },
    { title: '退款时间', dataIndex: 'refund_time', width: 200 },
    { title: '门店', dataIndex: 'order.store.name', fixed: 'right', width: 100 },
  ]);

  const { loading, setLoading } = useLoading(false);
  const renderData = ref<OrderRecord[]>([]);
  const basePagination = { current: 1, pageSize: 10 };
  const pagination = reactive<PaginationProps>({ ...basePagination, showPageSize: true, showTotal: true });
  const queryParams = reactive<OrderParams>({ ...basePagination });

  const fetchData = async (params = queryParams) => {
    try {
      setLoading(true);
      const { data, meta } = await queryOrderRefundList(params);
      renderData.value = data;
      pagination.total = meta.total;
      pagination.current = meta.page;
      pagination.pageSize = meta.page_size;
    } finally {
      setLoading(false);
    }
  };

  // 刷新
  const onRefresh = () => {
    queryParams.current = 1;
    fetchData();
  };

  // 翻页
  const onPageChange = (current: number) => {
    queryParams.current = current;
    fetchData();
  };

  // 每页数量变化
  const onPageSizeChange = (pageSize: number) => {
    queryParams.current = 1;
    queryParams.pageSize = pageSize;
    fetchData();
  };

  const OrderDetailDrawerRef = ref<InstanceType<typeof OrderDetailDrawer>>();

  onMounted(() => {
    fetchData();
  });
</script>
